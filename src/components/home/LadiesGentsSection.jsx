import { useLanguage } from "../../lib/i18n";
import { STUDIO_IMAGE, WEIGHT_IMAGE } from "@/lib/assets";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";
import SectionHeader from "../public/SectionHeader";

const MALE_IMG = WEIGHT_IMAGE;
const FEMALE_IMG = STUDIO_IMAGE;

export default function LadiesGentsSection() {
  const { t, lang } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const gentsImage = homepageMedia?.gents_image_url || MALE_IMG;
  const ladiesImage = homepageMedia?.ladies_image_url || FEMALE_IMG;

  return (
    <section className="py-16 md:py-24 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.ladies_gents")}
          subtitle={t("section.ladies_gents_sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gents */}
          <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={gentsImage} alt="Gents Section" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="inline-block px-3 py-1 bg-primary/20 rounded-full border border-primary/30 mb-3">
                <span className="text-primary text-xs font-bold tracking-wider">
                  {lang === "ar" ? "رجال" : "GENTS"}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-black text-foreground">
                {lang === "ar" ? "جلسة الرجال" : "Men's Session"}
              </h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                {lang === "ar"
                  ? "مساحة مجهزة بالكامل مع أحدث المعدات والمدربين المتخصصين"
                  : "Fully equipped space with cutting-edge equipment and specialized trainers"}
              </p>
            </div>
          </div>

          {/* Ladies */}
          <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={ladiesImage} alt="Ladies Section" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="inline-block px-3 py-1 bg-pink-500/20 rounded-full border border-pink-500/30 mb-3">
                <span className="text-pink-400 text-xs font-bold tracking-wider">
                  {lang === "ar" ? "سيدات" : "LADIES"}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-black text-foreground">
                {lang === "ar" ? "جلسة نسائية" : "Women's Session"}
              </h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                {lang === "ar"
                  ? "مساحة خاصة بالكامل مع مدربات معتمدات وبرامج متخصصة"
                  : "Fully private space with certified female trainers and specialized programs"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}