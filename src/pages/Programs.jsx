import { useLanguage } from "../lib/i18n";
import SectionHeader from "../components/public/SectionHeader";
import { Dumbbell, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";
import { WHATSAPP_URL } from "../lib/i18n";

const PROGRAMS = [
  { title_en: "Personal Training", title_ar: "تدريب شخصي", desc_en: "One-on-one customized sessions with certified trainers tailored to your specific fitness goals and body type.", desc_ar: "جلسات مخصصة فردية مع مدربين معتمدين مصممة لأهدافك البدنية ونوع جسمك.", category: "personal" },
  { title_en: "Zumba & Aerobics", title_ar: "زومبا وأيروبيكس", desc_en: "High-energy dance-based fitness classes that make working out fun while burning serious calories.", desc_ar: "حصص لياقة بدنية راقصة عالية الطاقة تجعل التمرين ممتعاً مع حرق سعرات حرارية جدية.", category: "group" },
  { title_en: "CrossFit & Tabata", title_ar: "كروس فت وتاباتا", desc_en: "High-intensity functional training combining cardio and strength for maximum results in minimum time.", desc_ar: "تدريب وظيفي عالي الكثافة يجمع بين الكارديو والقوة لأقصى النتائج في أقل وقت.", category: "strength" },
  { title_en: "Flexibility & Mobility", title_ar: "المرونة والحركة", desc_en: "Improve your range of motion, prevent injuries, and enhance recovery with guided flexibility sessions.", desc_ar: "حسّن نطاق حركتك وامنع الإصابات وعزز التعافي مع جلسات مرونة موجهة.", category: "flexibility" },
  { title_en: "Cardio & CrossFit", title_ar: "كارديو وكروس فت", desc_en: "Cardiovascular endurance training with state-of-the-art equipment and expert programming.", desc_ar: "تدريب التحمل القلبي الوعائي بأحدث المعدات والبرمجة المتخصصة.", category: "cardio" },
  { title_en: "Weight Management & Body Transformation", title_ar: "إدارة الوزن وتحويل الجسم", desc_en: "Comprehensive body transformation programs combining nutrition, training, and lifestyle coaching.", desc_ar: "برامج تحويل جسم شاملة تجمع بين التغذية والتدريب وتدريب نمط الحياة.", category: "personal" },
  { title_en: "Personal & Resistance Training", title_ar: "تدريب شخصي ومقاومة", desc_en: "Build strength and muscle with progressive resistance training guided by expert coaches.", desc_ar: "ابنِ القوة والعضلات مع تدريب المقاومة التدريجي بإرشاد مدربين خبراء.", category: "strength" },
];

export default function Programs() {
  const { t, lang, localizedField } = useLanguage();
  const { data: programs = [] } = useQuery({
    queryKey: ["programs-page"],
    queryFn: () => entities.Program.filter({ is_active: true }, "sort_order", 100),
  });

  const items = programs.length > 0 ? programs : PROGRAMS;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <SectionHeader title={t("section.programs")} subtitle={t("section.programs_sub")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((prog, i) => (
            <div key={i} className="group bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">
                {localizedField(prog, "title")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {localizedField(prog, "desc")}
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t("cta.whatsapp")}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}