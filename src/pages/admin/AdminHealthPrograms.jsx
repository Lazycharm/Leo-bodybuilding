import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminHealthPrograms() {
  const { t } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.health_programs")}
      entityName="HealthProgram"
      entity={entities.HealthProgram}
      queryKey="admin-health-programs"
      columns={[
        { field: "title_en", label: "Title (EN)" },
        { field: "title_ar", label: "Title (AR)" },
        { field: "target_condition", label: "Condition" },
        { field: "is_active", label: "Status", render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{v ? "Active" : "Inactive"}</span>
        )},
      ]}
      formFields={[
        { field: "title_en", label: "Title (English)" },
        { field: "title_ar", label: "Title (Arabic)" },
        { field: "description_en", label: "Description (English)", type: "textarea" },
        { field: "description_ar", label: "Description (Arabic)", type: "textarea" },
        { field: "short_desc_en", label: "Short Description (English)" },
        { field: "short_desc_ar", label: "Short Description (Arabic)" },
        { field: "image_url", label: "Image URL" },
        { field: "target_condition", label: "Target Condition" },
        { field: "is_active", label: "Active", type: "boolean" },
        { field: "sort_order", label: "Sort Order", type: "number" },
      ]}
      defaultValues={{ is_active: true, sort_order: 0 }}
    />
  );
}