import { useLanguage, WHATSAPP_URL } from "../lib/i18n";
import SectionHeader from "../components/public/SectionHeader";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";

export default function Trainers() {
  const { t, lang, localizedField } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: () => entities.Trainer.filter({ is_active: true }, "sort_order"),
  });

  const fallbackTrainers = [
    homepageMedia?.male_trainer_image_url
      ? {
          id: "male-fallback",
          name_en: "Expert Coach",
          name_ar: "مدرب خبير",
          title_en: "LEO Trainer",
          title_ar: "مدرب ليو",
          bio_en: "Professional training support tailored to your fitness goals.",
          bio_ar: "دعم تدريبي احترافي مصمم حسب أهدافك الرياضية.",
          photo_url: homepageMedia.male_trainer_image_url,
          specialties_en: [],
        }
      : null,
    homepageMedia?.female_trainer_image_url
      ? {
          id: "female-fallback",
          name_en: "Ladies Coach",
          name_ar: "مدربة السيدات",
          title_en: "LEO Trainer",
          title_ar: "مدربة ليو",
          bio_en: "Dedicated coaching support for ladies programs and private sessions.",
          bio_ar: "دعم تدريبي مخصص لبرامج السيدات والجلسات الخاصة.",
          photo_url: homepageMedia.female_trainer_image_url,
          specialties_en: [],
        }
      : null,
  ].filter(Boolean);

  const items = trainers.length > 0 ? trainers : fallbackTrainers;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <SectionHeader title={t("section.trainers")} subtitle={t("section.trainers_sub")} />
        </div>

        {isLoading ? (
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[3/4] animate-pulse bg-muted" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            {lang === "ar" ? "تمت إزالة صور المدربين التجريبية. أضف صور المدربين الحقيقيين من لوحة الإدارة لعرضها هنا." : "The demo trainer photos have been removed. Add your real trainers from the admin panel to show them here."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {items.map((trainer, i) => (
              <div key={trainer.id || i} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
                <div className="aspect-[3/4] overflow-hidden relative bg-slate-950">
                  {trainer.photo_url ? (
                    <img src={trainer.photo_url} alt={localizedField(trainer, "name")} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#111827_0%,#0f172a_55%,#020617_100%)]" />
                  )}
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
        )}
      </div>
    </div>
  );
}