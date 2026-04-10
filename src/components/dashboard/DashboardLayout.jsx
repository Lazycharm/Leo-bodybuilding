import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, Home, User, Calendar, Bell, MessageCircle, CreditCard, LogOut, Globe } from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { LEO_LOGO } from "@/lib/assets";

const MEMBER_NAV = [
  { key: "member.dashboard", path: "/dashboard", icon: Home },
  { key: "member.profile", path: "/dashboard/profile", icon: User },
  { key: "member.plan", path: "/dashboard/membership", icon: CreditCard },
  { key: "member.schedule", path: "/dashboard/schedule", icon: Calendar },
  { key: "member.announcements", path: "/dashboard/announcements", icon: Bell },
  { key: "member.support", path: "/dashboard/support", icon: MessageCircle },
];

export default function DashboardLayout() {
  const { t, lang, setLang } = useLanguage();
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`min-h-screen bg-background flex ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 start-0 z-50 w-64 bg-card border-e border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0 rtl:-translate-x-0" : "-translate-x-full rtl:translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <img src={LEO_LOGO} alt="LEO Gym" className="h-10 w-auto object-contain" />
              <div className="text-[10px] text-primary">{t("member.dashboard")}</div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-auto">
            {MEMBER_NAV.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-3 border-t border-border space-y-1">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors">
              <Globe className="w-5 h-5" />
              {lang === "en" ? "عربي" : "English"}
            </button>
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Home className="w-5 h-5" />
              {t("nav.home")}
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full transition-colors">
              <LogOut className="w-5 h-5" />
              {t("nav.logout")}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ms-2 text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-sm">{t("member.dashboard")}</span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}