import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, Mail, CreditCard, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { t, lang } = useLanguage();

  const { data: users = [] } = useQuery({ queryKey: ["admin-users"], queryFn: () => entities.User.list() });
  const { data: memberships = [] } = useQuery({ queryKey: ["admin-memberships"], queryFn: () => entities.Membership.list() });
  const { data: inquiries = [] } = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => entities.Inquiry.list("-created_date", 50) });

  const activeMemberships = memberships.filter((m) => m.status === "active");
  const newInquiries = inquiries.filter((i) => i.status === "new");
  const totalRevenue = memberships.reduce((sum, m) => sum + (m.amount_paid || 0), 0);
  const recentInquiries = inquiries.slice(0, 5);
  const recentUsers = [...users].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5);

  const stats = [
    { key: "admin.total_members", value: users.length, icon: Users, color: "text-blue-400 bg-blue-500/10" },
    { key: "admin.active_memberships", value: activeMemberships.length, icon: UserCheck, color: "text-green-400 bg-green-500/10" },
    { key: "admin.new_inquiries", value: newInquiries.length, icon: Mail, color: "text-yellow-400 bg-yellow-500/10" },
    { key: "admin.revenue", value: `AED ${totalRevenue.toLocaleString()}`, icon: CreditCard, color: "text-primary bg-primary/10" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-black text-foreground">{t("admin.dashboard")}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-heading font-black text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{t(stat.key)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-foreground text-sm">{t("admin.recent_inquiries")}</h2>
            <Link to="/admin/inquiries" className="text-primary text-xs hover:underline">{lang === "ar" ? "عرض الكل" : "View all"}</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">{t("common.no_data")}</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-foreground text-sm font-medium">{inq.name}</p>
                    <p className="text-muted-foreground text-xs">{inq.type} · {inq.email || inq.phone}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    inq.status === "new" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                  }`}>
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Signups */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-foreground text-sm">{t("admin.recent_signups")}</h2>
            <Link to="/admin/users" className="text-primary text-xs hover:underline">{lang === "ar" ? "عرض الكل" : "View all"}</Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">{t("common.no_data")}</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-foreground text-sm font-medium">{u.full_name}</p>
                    <p className="text-muted-foreground text-xs">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {new Date(u.created_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}