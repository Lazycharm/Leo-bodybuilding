import { useLanguage } from "../lib/i18n";
import SectionHeader from "../components/public/SectionHeader";
import { Link } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_PLANS = [
  { title_en: "Starter", title_ar: "المبتدئ", price: 199, duration_months: 1, features_en: ["Full gym access", "Locker room", "Free WiFi", "Basic fitness assessment"], features_ar: ["وصول كامل للصالة", "غرفة تبديل", "واي فاي مجاني", "تقييم لياقة أساسي"] },
  { title_en: "Pro", title_ar: "الاحترافي", price: 499, duration_months: 3, is_popular: true, features_en: ["Full gym access", "2 PT sessions/month", "Nutrition plan", "Locker room", "Priority booking", "Body composition analysis"], features_ar: ["وصول كامل للصالة", "جلستين تدريب شخصي/شهر", "خطة تغذية", "غرفة تبديل", "أولوية الحجز", "تحليل تكوين الجسم"] },
  { title_en: "Elite", title_ar: "النخبة", price: 899, duration_months: 6, features_en: ["Full gym access", "Unlimited PT sessions", "Custom nutrition plan", "Body composition analysis", "VIP locker", "All group classes", "Recovery sessions", "Monthly progress review"], features_ar: ["وصول كامل للصالة", "جلسات تدريب شخصي غير محدودة", "خطة تغذية مخصصة", "تحليل تكوين الجسم", "خزانة VIP", "جميع الحصص الجماعية", "جلسات استشفاء", "مراجعة تقدم شهرية"] },
  { title_en: "Annual VIP", title_ar: "سنوي VIP", price: 1499, duration_months: 12, features_en: ["Everything in Elite", "Personal diet coach", "Free guest passes (2/month)", "Priority class access", "Exclusive VIP events", "Free merchandise", "Spa access"], features_ar: ["كل شيء في النخبة", "مدرب نظام غذائي شخصي", "تصاريح ضيوف مجانية (2/شهر)", "أولوية الوصول للحصص", "فعاليات VIP حصرية", "بضائع مجانية", "وصول المنتجع الصحي"] },
];

export default function Plans() {
  const { t, lang, localizedField } = useLanguage();
  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: () => entities.MembershipPlan.filter({ is_active: true }, "sort_order"),
  });

  const items = plans.length > 0 ? plans : DEFAULT_PLANS;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <SectionHeader title={t("section.plans")} subtitle={t("section.plans_sub")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                plan.is_popular
                  ? "bg-primary/5 border-primary shadow-xl shadow-primary/10"
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
                  <span className="text-4xl font-heading font-black text-primary">{plan.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  / {plan.duration_months} {plan.duration_months === 1 ? t("plans.month") : t("plans.months")}
                </p>
              </div>
              <div className="space-y-3 mb-6">
                {(lang === "ar" ? plan.features_ar || plan.features_en : plan.features_en || []).map((f, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
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
      </div>
    </div>
  );
}