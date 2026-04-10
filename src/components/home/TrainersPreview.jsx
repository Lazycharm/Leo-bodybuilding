import { useLanguage } from "../../lib/i18n";
import { Link } from "react-router-dom";
import SectionHeader from "../public/SectionHeader";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";

export default function TrainersPreview() {
  const { t, lang, localizedField } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["trainers-preview"],
    queryFn: () => entities.Trainer.filter({ is_active: true }, "sort_order", 2),
  });

  const fallbackTrainers = [
    homepageMedia?.male_trainer_image_url
      ? {
          id: "male-fallback",
          name_en: "Expert Coach",
          name_ar: "مدرب خبير",
          title_en: "LEO Trainer",
          title_ar: "مدرب ليو",
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
          photo_url: homepageMedia.female_trainer_image_url,
          specialties_en: [],
        }
      : null,
  ].filter(Boolean);

  const items = trainers.length > 0 ? trainers : fallbackTrainers;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t("section.trainers")} subtitle={t("section.trainers_sub")} />

        {isLoading ? (
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[3/4] animate-pulse bg-muted" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {lang === "ar" ? "ستظهر صور المدربين هنا بعد إضافتها من لوحة الإدارة." : "Trainer photos will appear here after you add them from the admin panel."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {items.map((trainer, i) => (
              <div key={trainer.id || i} className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden bg-slate-950">
                  {trainer.photo_url ? (
                    <img
                      src={trainer.photo_url}
                      alt={localizedField(trainer, "name") || "Trainer"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#111827_0%,#0f172a_55%,#020617_100%)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading font-bold text-foreground text-xl">{localizedField(trainer, "name")}</h3>
                  <p className="text-primary text-sm font-medium">{localizedField(trainer, "title")}</p>
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
        )}

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