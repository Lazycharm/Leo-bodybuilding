import { useLanguage } from "../../lib/i18n";
import SectionHeader from "../public/SectionHeader";
import { Users, Droplets, Heart, Apple, DoorOpen, Dumbbell, Award } from "lucide-react";

const FEATURES = [
  { icon: Users, key: "why.female_trainer" },
  { icon: Droplets, key: "why.shower" },
  { icon: Heart, key: "why.cardio" },
  { icon: Apple, key: "why.nutrition" },
  { icon: DoorOpen, key: "why.changing" },
  { icon: Dumbbell, key: "why.studio" },
  { icon: Award, key: "why.certified" },
];

export default function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={`${t("why.title")} ${t("why.title2")}`}
          subtitle={t("why.subtitle")}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="group relative bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm">
                  {t(feat.key)}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}