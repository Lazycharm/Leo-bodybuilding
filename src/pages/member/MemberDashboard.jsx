import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bell, Calendar, CreditCard, MessageCircle } from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { entities } from "@/api/appClient";

export default function MemberDashboard() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const { data: memberships = [] } = useQuery({
    queryKey: ["member-membership-summary", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => entities.Membership.filter({ user_id: user.id }, "-created_at", 5),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["member-bookings-summary", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => entities.Booking.filter({ user_id: user.id }, "-created_at", 5),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["member-announcements-summary"],
    queryFn: () => entities.Announcement.filter({ is_active: true }, "-created_at", 3),
  });

  const activeMembership = memberships.find((membership) => membership.status === "active") || memberships[0];
  const upcomingBooking = bookings.find((booking) => ["pending", "confirmed"].includes(booking.status));

  const quickStats = [
    {
      label: t("member.plan"),
      value: activeMembership?.plan_name || t("member.no_membership"),
      icon: CreditCard,
      href: "/dashboard/membership",
    },
    {
      label: t("member.schedule"),
      value: upcomingBooking?.class_name || (lang === "ar" ? "لا يوجد حجز" : "No booking yet"),
      icon: Calendar,
      href: "/dashboard/schedule",
    },
    {
      label: t("member.announcements"),
      value: announcements[0]?.title_en || (lang === "ar" ? "لا توجد تحديثات" : "No updates"),
      icon: Bell,
      href: "/dashboard/announcements",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-foreground">{t("member.dashboard")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lang === "ar" ? `مرحباً ${user?.full_name || ""}` : `Welcome back, ${user?.full_name || "Member"}`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.href} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-foreground">{t("member.plan")}</h2>
            <Link to="/dashboard/membership" className="text-sm font-medium text-primary hover:text-primary/80">
              {lang === "ar" ? "عرض التفاصيل" : "View details"}
            </Link>
          </div>

          {activeMembership ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{lang === "ar" ? "الخطة" : "Plan"}</span>
                <span className="font-medium text-foreground">{activeMembership.plan_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("common.status")}</span>
                <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                  {activeMembership.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{lang === "ar" ? "ينتهي في" : "Ends on"}</span>
                <span className="text-foreground">{activeMembership.end_date || "-"}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("member.no_membership")}</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-foreground">{t("member.announcements")}</h2>
            <Link to="/dashboard/announcements" className="text-sm font-medium text-primary hover:text-primary/80">
              {lang === "ar" ? "عرض الكل" : "View all"}
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((item) => (
                <div key={item.id} className="rounded-xl border border-border/70 bg-background/50 p-3">
                  <p className="font-medium text-foreground">{lang === "ar" ? item.title_ar || item.title_en : item.title_en || item.title_ar}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {lang === "ar" ? item.content_ar || item.content_en : item.content_en || item.content_ar}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{lang === "ar" ? "لا توجد إعلانات حالياً" : "No announcements right now."}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2 text-foreground">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-lg font-bold">{t("member.support")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {lang === "ar"
            ? "هل تحتاج إلى مساعدة بخصوص عضويتك أو حجزك؟ تواصل معنا مباشرة من صفحة الدعم."
            : "Need help with your membership or booking? Reach out from the support page."}
        </p>
      </div>
    </div>
  );
}
