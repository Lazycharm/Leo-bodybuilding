import { useLanguage, WHATSAPP_URL } from "../lib/i18n";
import { FEMALE_TRAINER_IMAGE, MALE_TRAINER_IMAGE } from "@/lib/assets";
import SectionHeader from "../components/public/SectionHeader";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

const MALE_TRAINER_IMG = MALE_TRAINER_IMAGE;
const FEMALE_TRAINER_IMG = FEMALE_TRAINER_IMAGE;

const DEFAULT_TRAINERS = [
  { name_en: "Ahmed Hassan", name_ar: "أحمد حسن", title_en: "Head Strength Coach", title_ar: "مدرب القوة الرئيسي", bio_en: "With 12 years of experience in strength and conditioning, Ahmed has trained hundreds of members to achieve their peak physical form.", bio_ar: "مع 12 عاماً من الخبرة في القوة والتكييف، درب أحمد مئات الأعضاء لتحقيق أفضل شكل بدني.", photo_url: MALE_TRAINER_IMG, specialties_en: ["Strength Training", "CrossFit", "Body Building"], gender: "male", experience_years: 12 },
  { name_en: "Sara Al Mansoori", name_ar: "سارة المنصوري", title_en: "Ladies Fitness Director", title_ar: "مديرة لياقة السيدات", bio_en: "Sara specializes in women's fitness with expertise in Zumba, aerobics, and holistic wellness programs for ladies of all fitness levels.", bio_ar: "تتخصص سارة في لياقة المرأة مع خبرة في الزومبا والأيروبيكس وبرامج العافية الشاملة للسيدات من جميع مستويات اللياقة.", photo_url: FEMALE_TRAINER_IMG, specialties_en: ["Zumba", "Aerobics", "Yoga", "PCOS Programs"], gender: "female", experience_years: 8 },
];

export default function Trainers() {
  const { t, lang, localizedField } = useLanguage();
  const { data: trainers = [] } = useQuery({
    queryKey: ["trainers"],
    queryFn: () => entities.Trainer.filter({ is_active: true }, "sort_order"),
  });

  const items = trainers.length > 0 ? trainers : DEFAULT_TRAINERS;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <SectionHeader title={t("section.trainers")} subtitle={t("section.trainers_sub")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {items.map((trainer, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={trainer.photo_url || MALE_TRAINER_IMG}
                  alt={localizedField(trainer, "name")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-6 -mt-16 relative">
                <h3 className="font-heading font-bold text-foreground text-xl">{localizedField(trainer, "name")}</h3>
                <p className="text-primary text-sm font-medium mb-2">{localizedField(trainer, "title")}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{localizedField(trainer, "bio")}</p>
                {trainer.experience_years && (
                  <p className="text-xs text-muted-foreground mb-3">
                    {lang === "ar" ? `${trainer.experience_years} سنوات خبرة` : `${trainer.experience_years} years experience`}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(trainer.specialties_en || []).map((s, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{s}</span>
                  ))}
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("cta.whatsapp")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}