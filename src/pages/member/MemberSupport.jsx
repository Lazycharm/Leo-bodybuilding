import { Link } from "react-router-dom";
import { GYM_EMAIL, GOOGLE_MAPS_URL, PHONE_NUMBER, WHATSAPP_URL, useLanguage } from "../../lib/i18n";

export default function MemberSupport() {
  const { lang, t } = useLanguage();

  const supportItems = [
    { label: t("common.phone"), value: PHONE_NUMBER, href: `tel:${PHONE_NUMBER}` },
    { label: t("common.email"), value: GYM_EMAIL, href: `mailto:${GYM_EMAIL}` },
    { label: lang === "ar" ? "واتساب" : "WhatsApp", value: t("cta.whatsapp"), href: WHATSAPP_URL },
    { label: lang === "ar" ? "الموقع" : "Location", value: t("cta.location"), href: GOOGLE_MAPS_URL },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-foreground">{t("member.support")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lang === "ar" ? "تواصل مع فريق النادي لأي استفسار أو دعم متعلق بالعضوية." : "Reach the gym team for any membership or support request."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {supportItems.map((item) => (
          <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-2 font-medium text-foreground">{item.value}</p>
          </a>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-bold text-foreground">{lang === "ar" ? "إرسال رسالة جديدة" : "Send a new message"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "ar" ? "يمكنك استخدام نموذج التواصل العام لإرسال أي استفسار جديد مباشرة إلى الإدارة." : "Use the general contact form to send a new inquiry directly to the team."}
        </p>
        <Link to="/contact" className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
          {t("cta.contact")}
        </Link>
      </div>
    </div>
  );
}
