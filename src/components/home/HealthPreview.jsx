import { useLanguage } from "../../lib/i18n";
import { Link } from "react-router-dom";
import SectionHeader from "../public/SectionHeader";
import { ArrowRight, HeartPulse } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";

const DEFAULT_HEALTH = [
  { title_en: "Diet & Nutrition Guidance", title_ar: "إرشادات النظام الغذائي والتغذية", short_desc_en: "Personalized nutrition plans for optimal health", short_desc_ar: "خطط تغذية مخصصة للصحة المثلى" },
  { title_en: "BP & Heart Support", title_ar: "دعم ضغط الدم والقلب", short_desc_en: "Cardiovascular health monitoring and exercise", short_desc_ar: "مراقبة صحة القلب والأوعية الدموية والتمارين" },
  { title_en: "PCOS & Hormone Balance", title_ar: "تكيس المبايض وتوازن الهرمونات", short_desc_en: "Specialized fitness for hormonal health", short_desc_ar: "لياقة متخصصة للصحة الهرمونية" },
  { title_en: "Diabetes & Cholesterol Care", title_ar: "رعاية السكري والكوليسترول", short_desc_en: "Exercise programs for metabolic health", short_desc_ar: "برامج تمارين للصحة الأيضية" },
];

export default function HealthPreview() {
  const { t, localizedField } = useLanguage();
  const { data: healthPrograms = [] } = useQuery({
    queryKey: ["health-preview"],
    queryFn: () => entities.HealthProgram.filter({ is_active: true }, "sort_order", 4),
  });

  const items = healthPrograms.length > 0 ? healthPrograms : DEFAULT_HEALTH;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.health")}
          subtitle={t("section.health_sub")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <HeartPulse className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground mb-1">
                  {localizedField(item, "title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {localizedField(item, "short_desc")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/health-programs"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors group"
          >
            {t("cta.learn_more")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}