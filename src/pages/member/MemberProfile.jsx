import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function MemberProfile() {
  const { user, checkAppState } = useAuth();
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      full_name: user?.full_name || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      await entities.User.update(user.id, form);
      await checkAppState();
      toast({ title: lang === "ar" ? "تم تحديث الملف" : "Profile updated" });
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر التحديث" : "Unable to update profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-foreground">{t("member.profile")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lang === "ar" ? "حدّث معلومات حسابك الأساسية." : "Update your basic account information."}
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">{lang === "ar" ? "الاسم الكامل" : "Full name"}</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">{t("common.email")}</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">{t("common.phone")}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 text-sm">
          <span className="text-muted-foreground">{lang === "ar" ? "الدور" : "Role"}</span>
          <span className="font-medium text-foreground">{user?.role || "member"}</span>
        </div>

        <button type="submit" disabled={saving} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
          {saving ? t("common.loading") : t("common.save")}
        </button>
      </form>
    </div>
  );
}
