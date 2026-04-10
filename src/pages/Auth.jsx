import { useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Loader2, Lock, Mail, Shield, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { LEO_LOGO } from "@/lib/assets";

export default function Auth() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { signIn, signUp, resetPassword, isAuthenticated, user, isLoadingAuth, authError } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const redirectTo = searchParams.get("redirectTo");

  const copy = useMemo(
    () => ({
      title: mode === "signup"
        ? lang === "ar" ? "إنشاء حساب جديد" : "Create your account"
        : lang === "ar" ? "تسجيل الدخول" : "Sign in",
      subtitle: lang === "ar"
        ? "استخدم البريد الإلكتروني وكلمة المرور للوصول إلى لوحة العضو أو الإدارة."
        : "Use your email and password to access the member or admin dashboard.",
      fullName: lang === "ar" ? "الاسم الكامل" : "Full name",
      email: lang === "ar" ? "البريد الإلكتروني" : "Email address",
      password: lang === "ar" ? "كلمة المرور" : "Password",
      submit: mode === "signup"
        ? lang === "ar" ? "إنشاء الحساب" : "Create account"
        : lang === "ar" ? "دخول" : "Sign in",
      switchPrompt: mode === "signup"
        ? lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"
        : lang === "ar" ? "ليس لديك حساب؟" : "Need an account?",
      switchAction: mode === "signup"
        ? lang === "ar" ? "تسجيل الدخول" : "Sign in"
        : lang === "ar" ? "إنشاء حساب" : "Create one",
      forgot: lang === "ar" ? "إرسال رابط إعادة تعيين كلمة المرور" : "Send password reset link",
      home: lang === "ar" ? "العودة للرئيسية" : "Back home",
    }),
    [lang, mode],
  );

  if (isAuthenticated && user) {
    const destination = redirectTo || (user.role === "admin" ? "/admin" : "/dashboard");
    return <Navigate to={destination} replace />;
  }

  const handleModeChange = (nextMode) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextMode === "signup") {
      nextParams.set("mode", "signup");
    } else {
      nextParams.delete("mode");
    }
    setSearchParams(nextParams);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "signup") {
        await signUp({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
        });

        toast({
          title: lang === "ar" ? "تم إنشاء الحساب" : "Account created",
          description: lang === "ar"
            ? "يمكنك الآن تسجيل الدخول باستخدام بياناتك."
            : "You can now sign in with your credentials.",
        });

        handleModeChange("login");
      } else {
        await signIn({
          email: form.email,
          password: form.password,
        });
      }
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر إكمال العملية" : "Unable to complete request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!form.email) {
      toast({
        title: lang === "ar" ? "أدخل بريدك أولاً" : "Enter your email first",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword(form.email);
      toast({
        title: lang === "ar" ? "تم إرسال الرابط" : "Reset link sent",
        description: lang === "ar"
          ? "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور."
          : "Check your email for the password reset link.",
      });
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر إرسال الرابط" : "Unable to send reset link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-background px-4 py-10 ${lang === "ar" ? "rtl" : "ltr"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-primary/5 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <img src={LEO_LOGO} alt="LEO Gym" className="h-12 w-auto" />
            <div className="mt-10 space-y-4">
              <h1 className="text-4xl font-heading font-black text-foreground">LEO Gym</h1>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {lang === "ar"
                  ? "بوابة موحدة للأعضاء والإدارة مبنية على Supabase وجاهزة للنشر على Netlify."
                  : "A unified member and admin portal powered by Supabase and ready for Netlify deployment."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              {lang === "ar" ? "تنبيه الإعداد" : "Setup note"}
            </div>
            <p>
              {isSupabaseConfigured
                ? (lang === "ar" ? "تم ربط الواجهة بطبقة Supabase الجديدة." : "The frontend is connected to the new Supabase layer.")
                : (lang === "ar" ? "أضف متغيرات البيئة الخاصة بـ Supabase قبل استخدام تسجيل الدخول." : "Add your Supabase environment variables before using authentication.")}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              ← {copy.home}
            </Link>
            <button
              onClick={() => handleModeChange(mode === "signup" ? "login" : "signup")}
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              {copy.switchAction}
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-heading font-black text-foreground">{copy.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {lang === "ar"
                ? "متغيرات Supabase غير مضافة بعد. قم بضبط ملف البيئة أولاً."
                : "Supabase environment variables are missing. Configure your env file first."}
            </div>
          )}

          {authError?.message && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {authError.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">{copy.fullName}</span>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    required
                    className="w-full bg-transparent py-3 text-sm text-foreground outline-none"
                    placeholder={copy.fullName}
                  />
                </div>
              </label>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">{copy.email}</span>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  className="w-full bg-transparent py-3 text-sm text-foreground outline-none"
                  placeholder={copy.email}
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">{copy.password}</span>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  required
                  minLength={6}
                  className="w-full bg-transparent py-3 text-sm text-foreground outline-none"
                  placeholder={copy.password}
                />
              </div>
            </label>

            <Button type="submit" disabled={submitting || isLoadingAuth || !isSupabaseConfigured} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {copy.submit}
            </Button>
          </form>

          <button
            type="button"
            onClick={handleResetPassword}
            className="mt-4 text-sm font-medium text-primary hover:text-primary/80"
          >
            {copy.forgot}
          </button>

          <p className="mt-6 text-sm text-muted-foreground">
            {copy.switchPrompt}{" "}
            <button type="button" onClick={() => handleModeChange(mode === "signup" ? "login" : "signup")} className="font-medium text-primary hover:text-primary/80">
              {copy.switchAction}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
