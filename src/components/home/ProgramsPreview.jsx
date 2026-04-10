import { useLanguage } from "../../lib/i18n";
import { Link } from "react-router-dom";
import SectionHeader from "../public/SectionHeader";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell, ArrowRight } from "lucide-react";

export default function ProgramsPreview() {
  const { t, lang, localizedField } = useLanguage();
  const { data: programs = [] } = useQuery({
    queryKey: ["programs-preview"],
    queryFn: () => entities.Program.filter({ is_active: true }, "sort_order", 6),
  });

  const defaultPrograms = [
    { title_en: "Personal Training", title_ar: "تدريب شخصي", short_desc_en: "One-on-one sessions with certified trainers", short_desc_ar: "جلسات فردية مع مدربين معتمدين" },
    { title_en: "Zumba & Aerobics", title_ar: "زومبا وأيروبيكس", short_desc_en: "Fun and energetic group classes", short_desc_ar: "حصص جماعية ممتعة ونشيطة" },
    { title_en: "CrossFit & Tabata", title_ar: "كروس فت وتاباتا", short_desc_en: "High-intensity functional training", short_desc_ar: "تدريب وظيفي عالي الكثافة" },
    { title_en: "Flexibility & Mobility", title_ar: "المرونة والحركة", short_desc_en: "Improve range of motion and flexibility", short_desc_ar: "حسّن نطاق الحركة والمرونة" },
    { title_en: "Cardio Zone", title_ar: "منطقة الكارديو", short_desc_en: "State-of-the-art cardio equipment", short_desc_ar: "أحدث معدات الكارديو" },
    { title_en: "Weight Management", title_ar: "إدارة الوزن", short_desc_en: "Body transformation programs", short_desc_ar: "برامج تحويل الجسم" },
  ];

  const items = programs.length > 0 ? programs : defaultPrograms;

  return (
    <section className="py-16 md:py-24 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.programs")}
          subtitle={t("section.programs_sub")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((prog, i) => (
            <div
              key={i}
              className="group relative bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg mb-2">
                  {localizedField(prog, "title")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {localizedField(prog, "short_desc")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/programs"
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