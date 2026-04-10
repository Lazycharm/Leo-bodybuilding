import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { entities } from "@/api/appClient";
import { useLanguage } from "../../lib/i18n";

export default function MemberMembership() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const { data: memberships = [] } = useQuery({
    queryKey: ["member-memberships", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => entities.Membership.filter({ user_id: user.id }, "-created_at", 20),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-foreground">{t("member.plan")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lang === "ar" ? "استعرض حالة عضويتك الحالية وسجل التجديد." : "Review your current membership status and renewal history."}
        </p>
      </div>

      {memberships.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {t("member.no_membership")}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memberships.map((membership) => (
            <div key={membership.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">{membership.plan_name || "Membership"}</h2>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  membership.status === "active"
                    ? "bg-green-500/10 text-green-400"
                    : membership.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-muted text-muted-foreground"
                }`}>
                  {membership.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{lang === "ar" ? "تاريخ البدء" : "Start date"}: <span className="text-foreground">{membership.start_date || "-"}</span></p>
                <p>{lang === "ar" ? "تاريخ الانتهاء" : "End date"}: <span className="text-foreground">{membership.end_date || "-"}</span></p>
                <p>{lang === "ar" ? "المدفوع" : "Amount paid"}: <span className="text-foreground">{membership.amount_paid ? `AED ${membership.amount_paid}` : "-"}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
