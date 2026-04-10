import { useLanguage, WHATSAPP_URL } from "../lib/i18n";
import SectionHeader from "../components/public/SectionHeader";
import { HeartPulse, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";

const HEALTH_PROGRAMS = [
  { title_en: "Diet & Nutrition Guidance", title_ar: "إرشادات النظام الغذائي والتغذية", desc_en: "Personalized nutrition plans crafted by health professionals to support your fitness journey and overall wellbeing.", desc_ar: "خطط تغذية مخصصة من محترفي الصحة لدعم رحلة لياقتك ورفاهيتك العامة." },
  { title_en: "BP & Heart Support", title_ar: "دعم ضغط الدم والقلب", desc_en: "Specialized exercise programming for cardiovascular health with blood pressure monitoring and heart-safe workouts.", desc_ar: "برمجة تمارين متخصصة لصحة القلب والأوعية الدموية مع مراقبة ضغط الدم وتمارين آمنة للقلب." },
  { title_en: "PCOS & Hormone Balance", title_ar: "تكيس المبايض وتوازن الهرمونات", desc_en: "Fitness programs designed specifically for women dealing with PCOS, focusing on hormone balance through exercise and lifestyle.", desc_ar: "برامج لياقة مصممة خصيصاً للنساء اللواتي يعانين من تكيس المبايض، مع التركيز على توازن الهرمونات من خلال التمارين ونمط الحياة." },
  { title_en: "Diabetes & Cholesterol Care", title_ar: "رعاية السكري والكوليسترول", desc_en: "Safe, effective exercise programs for managing diabetes and cholesterol levels with professional supervision.", desc_ar: "برامج تمارين آمنة وفعالة لإدارة مستويات السكري والكوليسترول تحت إشراف مهني." },
];

export default function HealthPrograms() {
  const { t, localizedField } = useLanguage();
  const { data: healthPrograms = [] } = useQuery({
    queryKey: ["health-programs-page"],
    queryFn: () => entities.HealthProgram.filter({ is_active: true }, "sort_order", 100),
  });

  const items = healthPrograms.length > 0 ? healthPrograms : HEALTH_PROGRAMS;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <SectionHeader title={t("section.health")} subtitle={t("section.health_sub")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((prog, i) => (
            <div key={i} className="group bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-red-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                <HeartPulse className="w-6 h-6 text-red-400" />
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