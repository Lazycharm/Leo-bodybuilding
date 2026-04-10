import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Globe, LogOut, Menu, Shield, UserCircle, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { LEO_LOGO } from "@/lib/assets";

const NAV_ITEMS = [
  { key: "nav.home", to: "/" },
  { key: "nav.about", to: "/about" },
  { key: "nav.programs", to: "/programs" },
  { key: "nav.health", to: "/health-programs" },
  { key: "nav.trainers", to: "/trainers" },
  { key: "nav.plans", to: "/plans" },
  { key: "nav.gallery", to: "/gallery" },
  { key: "nav.contact", to: "/contact" },
];

export default function PublicLayout() {
  const { t, lang, setLang } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const accountRoute = user?.role === "admin" ? "/admin" : "/dashboard";
  const accountLabel = user?.role === "admin" ? t("nav.admin") : t("nav.dashboard");

  return (
    <div className={`min-h-screen bg-background text-foreground ${lang === "ar" ? "rtl" : "ltr"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={LEO_LOGO} alt="LEO Gym" className="h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              {lang === "en" ? "عربي" : "English"}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to={accountRoute}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {user?.role === "admin" ? <Shield className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />}
                  {accountLabel}
                </Link>
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <UserCircle className="h-4 w-4" />
                {t("nav.login")}
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex rounded-lg p-2 text-foreground lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-card lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}

              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                {lang === "en" ? "عربي" : "English"}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to={accountRoute}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {accountLabel}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <UserCircle className="h-4 w-4" />
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <div>
            <p className="font-medium text-foreground">LEO Body Building Gym</p>
            <p>{t("footer.tagline")}</p>
          </div>
          <p>© {new Date().getFullYear()} LEO Gym. {t("footer.rights")}.</p>
        </div>
      </footer>
    </div>
  );
}
