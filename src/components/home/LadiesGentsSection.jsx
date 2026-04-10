import { useLanguage } from "../../lib/i18n";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";
import SectionHeader from "../public/SectionHeader";

function SessionCard({ image, badge, title, description, badgeClassName }) {
  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-slate-950">
      {image ? (
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(230,179,47,0.18),transparent_22%),linear-gradient(135deg,#0f172a_0%,#111827_50%,#020617_100%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className={`mb-3 inline-block rounded-full border px-3 py-1 ${badgeClassName}`}>
          <span className="text-xs font-bold tracking-wider">{badge}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-heading font-black text-foreground">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function LadiesGentsSection() {
  const { t, lang } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const gentsImage = homepageMedia?.gents_image_url?.trim() || "";
  const ladiesImage = homepageMedia?.ladies_image_url?.trim() || "";

  return (
    <section className="py-16 md:py-24 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t("section.ladies_gents")} subtitle={t("section.ladies_gents_sub")} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SessionCard
            image={gentsImage}
            badge={lang === "ar" ? "رجال" : "GENTS"}
            title={lang === "ar" ? "جلسة الرجال" : "Men's Session"}
            description={
              lang === "ar"
                ? "مساحة مجهزة بالكامل مع أحدث المعدات والمدربين المتخصصين"
                : "Fully equipped space with cutting-edge equipment and specialized trainers"
            }
            badgeClassName="border-primary/30 bg-primary/20 text-primary"
          />

          <SessionCard
            image={ladiesImage}
            badge={lang === "ar" ? "سيدات" : "LADIES"}
            title={lang === "ar" ? "جلسة نسائية" : "Women's Session"}
            description={
              lang === "ar"
                ? "مساحة خاصة بالكامل مع مدربات معتمدات وبرامج متخصصة"
                : "Fully private space with certified female trainers and specialized programs"
            }
            badgeClassName="border-pink-500/30 bg-pink-500/20 text-pink-400"
          />
        </div>
      </div>
    </section>
  );
}