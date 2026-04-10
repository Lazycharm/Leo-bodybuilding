import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminGallery() {
  const { t } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.gallery")}
      entityName="GalleryItem"
      entity={entities.GalleryItem}
      queryKey="admin-gallery"
      columns={[
        { field: "title_en", label: "Title (EN)" },
        { field: "category", label: "Category" },
        { field: "image_url", label: "Image", render: (v) => v ? <img src={v} alt="" className="w-12 h-12 rounded object-cover" /> : "—" },
        { field: "is_active", label: "Status", render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{v ? "Active" : "Inactive"}</span>
        )},
      ]}
      formFields={[
        { field: "title_en", label: "Title (English)" },
        { field: "title_ar", label: "Title (Arabic)" },
        { field: "image_url", label: "Image URL" },
        { field: "category", label: "Category", type: "select", options: [
          { value: "facility", label: "Facility" },
          { value: "training", label: "Training" },
          { value: "transformation", label: "Transformation" },
          { value: "event", label: "Event" },
          { value: "equipment", label: "Equipment" },
        ]},
        { field: "is_active", label: "Active", type: "boolean" },
        { field: "sort_order", label: "Sort Order", type: "number" },
      ]}
      defaultValues={{ is_active: true, sort_order: 0 }}
    />
  );
}