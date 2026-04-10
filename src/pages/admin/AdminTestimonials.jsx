import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminTestimonials() {
  const { t } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.testimonials")}
      entityName="Testimonial"
      entity={entities.Testimonial}
      queryKey="admin-testimonials"
      columns={[
        { field: "name_en", label: "Name (EN)" },
        { field: "text_en", label: "Text", render: (v) => v ? v.substring(0, 60) + "..." : "" },
        { field: "rating", label: "Rating", render: (v) => "⭐".repeat(v || 0) },
        { field: "is_active", label: "Status", render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{v ? "Active" : "Inactive"}</span>
        )},
      ]}
      formFields={[
        { field: "name_en", label: "Name (English)" },
        { field: "name_ar", label: "Name (Arabic)" },
        { field: "text_en", label: "Testimonial (English)", type: "textarea" },
        { field: "text_ar", label: "Testimonial (Arabic)", type: "textarea" },
        { field: "rating", label: "Rating (1-5)", type: "number" },
        { field: "program_en", label: "Program (English)" },
        { field: "program_ar", label: "Program (Arabic)" },
        { field: "photo_url", label: "Photo URL" },
        { field: "is_active", label: "Active", type: "boolean" },
        { field: "sort_order", label: "Sort Order", type: "number" },
      ]}
      defaultValues={{ is_active: true, rating: 5, sort_order: 0 }}
    />
  );
}