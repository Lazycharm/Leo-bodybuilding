import { useLanguage } from "../../lib/i18n";
import SectionHeader from "../public/SectionHeader";
import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";

const DEFAULT_TESTIMONIALS = [
  { name_en: "Khalid M.", name_ar: "خالد م.", text_en: "LEO Gym completely transformed my fitness journey. The trainers are world-class and the equipment is top-notch. Best gym in Ajman!", text_ar: "نادي ليو غيّر رحلة لياقتي بالكامل. المدربون على مستوى عالمي والمعدات من أعلى المستويات. أفضل نادي في عجمان!", rating: 5, program_en: "Weight Training" },
  { name_en: "Fatima A.", name_ar: "فاطمة أ.", text_en: "The ladies section is amazing! Private, well-equipped, and the female trainers are incredibly supportive. I lost 15kg in 4 months.", text_ar: "قسم السيدات رائع! خاص ومجهز جيداً والمدربات داعمات بشكل لا يصدق. فقدت 15 كيلو في 4 أشهر.", rating: 5, program_en: "Zumba & Aerobics" },
  { name_en: "Omar H.", name_ar: "عمر ح.", text_en: "Professional atmosphere, clean facilities, and trainers who genuinely care. I've been a member for 2 years and wouldn't go anywhere else.", text_ar: "أجواء احترافية ومرافق نظيفة ومدربون يهتمون حقاً. كنت عضواً لمدة عامين ولن أذهب إلى أي مكان آخر.", rating: 5, program_en: "CrossFit" },
];

export default function TestimonialsPreview() {
  const { t, lang, localizedField } = useLanguage();
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials-preview"],
    queryFn: () => entities.Testimonial.filter({ is_active: true }, "sort_order", 6),
  });

  const items = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.testimonials")}
          subtitle={t("section.testimonials_sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all">
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{localizedField(item, "text")}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {localizedField(item, "name").charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-heading font-bold text-foreground text-sm">
                    {localizedField(item, "name")}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}