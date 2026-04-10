import { useLanguage } from "../lib/i18n";
import { GALLERY_IMAGES } from "@/lib/assets";
import SectionHeader from "../components/public/SectionHeader";
import { entities } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";

const IMAGES = GALLERY_IMAGES;

export default function Gallery() {
  const { t, localizedField } = useLanguage();
  const { data: items = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => entities.GalleryItem.filter({ is_active: true }, "sort_order"),
  });

  const images = items.length > 0 ? items.map((i) => ({ url: i.image_url, title: localizedField(i, "title") })) : IMAGES.map((url, i) => ({ url, title: `LEO Gym ${i + 1}` }));

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <SectionHeader title={t("section.gallery")} subtitle={t("section.gallery_sub")} />
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <div key={i} className="group relative rounded-xl overflow-hidden break-inside-avoid">
              <img
                src={img.url}
                alt={img.title}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}