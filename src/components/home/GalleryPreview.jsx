import { useLanguage } from "../../lib/i18n";
import { Link } from "react-router-dom";
import SectionHeader from "../public/SectionHeader";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";
import { HERO_IMAGE, INTERIOR_IMAGE, STUDIO_IMAGE, WEIGHT_IMAGE } from "@/lib/assets";

const HERO_IMG = HERO_IMAGE;
const INTERIOR_IMG = INTERIOR_IMAGE;
const WEIGHT_IMG = WEIGHT_IMAGE;
const STUDIO_IMG = STUDIO_IMAGE;

export default function GalleryPreview() {
  const { t } = useLanguage();
  const { data: homepageMedia } = useHomepageMedia();
  const { data: items = [] } = useQuery({
    queryKey: ["gallery-preview"],
    queryFn: () => entities.GalleryItem.filter({ is_active: true }, "sort_order", 4),
  });

  const fallbackImages = homepageMedia?.gallery_preview_images?.length
    ? homepageMedia.gallery_preview_images
    : [HERO_IMG, INTERIOR_IMG, WEIGHT_IMG, STUDIO_IMG];

  const images = items.length > 0 ? items.map((item) => item.image_url).slice(0, 4) : fallbackImages;

  return (
    <section className="py-16 md:py-24 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.gallery")}
          subtitle={t("section.gallery_sub")}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`group relative rounded-xl overflow-hidden ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              } aspect-square`}
            >
              <img
                src={img}
                alt={`LEO Gym ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </div>
          ))}
        </div>

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