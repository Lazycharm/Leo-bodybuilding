import { useLanguage } from "../lib/i18n";
import SectionHeader from "../components/public/SectionHeader";
import { Award, Target, Heart, Users } from "lucide-react";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";

export default function About() {
  const { t, lang } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const aboutImage = homepageMedia?.hero_image_url || homepageMedia?.gents_image_url || homepageMedia?.ladies_image_url || "";

  const values = [
    { icon: Target, title_en: "Excellence", title_ar: "التميز", desc_en: "We strive for the highest standards in everything we do", desc_ar: "نسعى لأعلى المعايير في كل ما نقوم به" },
    { icon: Heart, title_en: "Community", title_ar: "المجتمع", desc_en: "Building a supportive fitness family in Ajman", desc_ar: "بناء عائلة لياقة بدنية داعمة في عجمان" },
    { icon: Award, title_en: "Results", title_ar: "النتائج", desc_en: "Proven track record of member transformations", desc_ar: "سجل حافل من تحولات الأعضاء" },
    { icon: Users, title_en: "Inclusivity", title_ar: "الشمولية", desc_en: "Dedicated spaces for both ladies and gentlemen", desc_ar: "مساحات مخصصة لكل من السيدات والرجال" },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-64 md:h-96 mb-12">
        {aboutImage ? (
          <img src={aboutImage} alt="LEO Gym" className="w-full h-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(230,179,47,0.18),transparent_25%),linear-gradient(135deg,#111827_0%,#0f172a_55%,#020617_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-heading font-black text-gold-gradient">{t("about.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("about.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("about.desc1")}</p>
            <p className="text-muted-foreground leading-relaxed">{t("about.desc2")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-heading font-black text-primary">500+</div>
              <div className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "عضو نشط" : "Active Members"}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-heading font-black text-primary">15+</div>
              <div className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "مدرب معتمد" : "Certified Trainers"}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-heading font-black text-primary">10+</div>
              <div className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "سنوات خبرة" : "Years Experience"}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-heading font-black text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "دعم متواصل" : "Support"}</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <SectionHeader title={lang === "ar" ? "قيمنا" : "OUR VALUES"} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{lang === "ar" ? v.title_ar : v.title_en}</h3>
                <p className="text-muted-foreground text-sm">{lang === "ar" ? v.desc_ar : v.desc_en}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}