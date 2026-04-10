import { useLanguage } from "../lib/i18n";
import SectionHeader from "../components/public/SectionHeader";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";

export default function Gallery() {
  const { t, localizedField, lang } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => entities.GalleryItem.filter({ is_active: true }, "sort_order"),
  });

  const databaseImages = items.map((item, index) => ({
    url: item.image_url,
    title: localizedField(item, "title") || `LEO Gym ${index + 1}`,
  })).filter((item) => item.url);

  const fallbackImages = (homepageMedia?.gallery_preview_images || []).filter(Boolean).map((url, index) => ({
    url,
    title: `LEO Gym ${index + 1}`,
  }));

  const images = databaseImages.length > 0 ? databaseImages : fallbackImages;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <SectionHeader title={t("section.gallery")} subtitle={t("section.gallery_sub")} />
        </div>

        {isLoading ? (
          <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted break-inside-avoid" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            {lang === "ar" ? "لا توجد صور قديمة معروضة الآن. أضف صورك من لوحة الإدارة وسيتم عرضها هنا فقط." : "No old gallery photos are shown now. Add your images from the admin panel and only those will appear here."}
          </div>
        ) : (
          <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
            {images.map((img, i) => (
              <div key={`${img.url}-${i}`} className="group relative rounded-xl overflow-hidden break-inside-avoid">
                <img src={img.url} alt={img.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">{img.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}