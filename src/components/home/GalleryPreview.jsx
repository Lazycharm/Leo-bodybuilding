import { useLanguage } from "../../lib/i18n";
import { Link } from "react-router-dom";
import SectionHeader from "../public/SectionHeader";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";

export default function GalleryPreview() {
  const { t, lang } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["gallery-preview"],
    queryFn: () => entities.GalleryItem.filter({ is_active: true }, "sort_order", 4),
  });

  const galleryImages = items.map((item) => item.image_url).filter(Boolean).slice(0, 4);
  const settingImages = (homepageMedia?.gallery_preview_images || []).filter(Boolean).slice(0, 4);
  const images = galleryImages.length > 0 ? galleryImages : settingImages;

  return (
    <section className="py-16 md:py-24 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t("section.gallery")} subtitle={t("section.gallery_sub")} />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`animate-pulse rounded-xl bg-muted ${i === 0 ? "aspect-square md:col-span-2 md:row-span-2" : "aspect-square"}`} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {lang === "ar" ? "ستظهر صور المعرض هنا بعد إضافتها من لوحة الإدارة." : "Gallery images will appear here after you add them from the admin panel."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {images.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className={`group relative overflow-hidden rounded-xl ${i === 0 ? "aspect-square md:col-span-2 md:row-span-2" : "aspect-square"}`}
              >
                <img src={img} alt={`LEO Gym ${i + 1}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/gallery"
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