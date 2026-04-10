import { useLanguage } from "../../lib/i18n";
import { Link } from "react-router-dom";
import SectionHeader from "../public/SectionHeader";
import { Check, ArrowRight, Star } from "lucide-react";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_PLANS = [
  {
    title_en: "Starter", title_ar: "المبتدئ", price: 199, duration_months: 1,
    features_en: ["Full gym access", "Locker room", "Free WiFi"],
    features_ar: ["وصول كامل للصالة", "غرفة تبديل", "واي فاي مجاني"],
  },
  {
    title_en: "Pro", title_ar: "الاحترافي", price: 499, duration_months: 3, is_popular: true,
    features_en: ["Full gym access", "2 PT sessions/month", "Nutrition plan", "Locker room", "Priority booking"],
    features_ar: ["وصول كامل للصالة", "جلستين تدريب شخصي/شهر", "خطة تغذية", "غرفة تبديل", "أولوية الحجز"],
  },
  {
    title_en: "Elite", title_ar: "النخبة", price: 899, duration_months: 6,
    features_en: ["Full gym access", "Unlimited PT sessions", "Custom nutrition plan", "Body composition analysis", "VIP locker", "All group classes"],
    features_ar: ["وصول كامل للصالة", "جلسات تدريب شخصي غير محدودة", "خطة تغذية مخصصة", "تحليل تكوين الجسم", "خزانة VIP", "جميع الحصص الجماعية"],
  },
];

export default function PlansPreview() {
  const { t, lang, localizedField } = useLanguage();
  const { data: plans = [] } = useQuery({
    queryKey: ["plans-preview"],
    queryFn: () => entities.MembershipPlan.filter({ is_active: true }, "sort_order", 3),
  });

  const items = plans.length > 0 ? plans : DEFAULT_PLANS;

  return (
    <section className="py-16 md:py-24 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.plans")}
          subtitle={t("section.plans_sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border p-6 md:p-8 transition-all duration-300 ${
                plan.is_popular
                  ? "bg-primary/5 border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    <Star className="w-3 h-3" />
                    {t("plans.popular")}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-heading font-bold text-foreground text-xl mb-4">
                  {localizedField(plan, "title")}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-muted-foreground text-sm">{t("plans.aed")}</span>
                  <span className="text-4xl md:text-5xl font-heading font-black text-primary">{plan.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  / {plan.duration_months} {plan.duration_months === 1 ? t("plans.month") : t("plans.months")}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {(lang === "ar" ? plan.features_ar || plan.features_en : plan.features_en || []).map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className={`block text-center py-3 rounded-lg font-bold text-sm tracking-wider transition-all ${
                  plan.is_popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {t("plans.select")}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors group"
          >
            {t("cta.view_plans")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}