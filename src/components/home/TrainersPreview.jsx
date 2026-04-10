import { useLanguage } from "../../lib/i18n";
import { Link } from "react-router-dom";
import SectionHeader from "../public/SectionHeader";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";
import { FEMALE_TRAINER_IMAGE, MALE_TRAINER_IMAGE } from "@/lib/assets";

const MALE_TRAINER_IMG = MALE_TRAINER_IMAGE;
const FEMALE_TRAINER_IMG = FEMALE_TRAINER_IMAGE;

export default function TrainersPreview() {
  const { t, localizedField } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const { data: trainers = [] } = useQuery({
    queryKey: ["trainers-preview"],
    queryFn: () => entities.Trainer.filter({ is_active: true }, "sort_order", 2),
  });

  const defaultTrainers = [
    {
      name_en: "Ahmed Hassan",
      name_ar: "أحمد حسن",
      title_en: "Head Strength Coach",
      title_ar: "مدرب القوة الرئيسي",
      photo_url: homepageMedia?.male_trainer_image_url || MALE_TRAINER_IMG,
      specialties_en: ["Strength Training", "CrossFit"],
    },
    {
      name_en: "Sara Al Mansoori",
      name_ar: "سارة المنصوري",
      title_en: "Ladies Fitness Specialist",
      title_ar: "أخصائية لياقة السيدات",
      photo_url: homepageMedia?.female_trainer_image_url || FEMALE_TRAINER_IMG,
      specialties_en: ["Zumba", "Aerobics", "Yoga"],
    },
  ];

  const items = trainers.length > 0 ? trainers : defaultTrainers;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.trainers")}
          subtitle={t("section.trainers_sub")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {items.map((trainer, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={trainer.photo_url}
                  alt={localizedField(trainer, "name")}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading font-bold text-foreground text-xl">
                  {localizedField(trainer, "name")}
                </h3>
                <p className="text-primary text-sm font-medium">
                  {localizedField(trainer, "title")}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(trainer.specialties_en || []).map((s, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/trainers"
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