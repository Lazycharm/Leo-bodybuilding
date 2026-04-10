import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";

export default function AdminUsers() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: () => entities.User.list("-created_date", 100) });

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (u.full_name || "").toLowerCase().includes(s) || (u.email || "").toLowerCase().includes(s);
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-black text-foreground mb-6">{t("admin.users")}</h1>

      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("common.search")} className="w-full ps-10 pe-4 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-start px-4 py-3 text-muted-foreground font-medium text-xs">{t("common.name")}</th>
                <th className="text-start px-4 py-3 text-muted-foreground font-medium text-xs">{t("common.email")}</th>
                <th className="text-start px-4 py-3 text-muted-foreground font-medium text-xs">{lang === "ar" ? "الدور" : "Role"}</th>
                <th className="text-start px-4 py-3 text-muted-foreground font-medium text-xs">{lang === "ar" ? "الانضمام" : "Joined"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t("common.loading")}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t("common.no_data")}</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{u.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        u.role === "admin" ? "bg-red-500/10 text-red-400" : u.role === "trainer" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                      }`}>{u.role || "member"}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(u.created_date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}