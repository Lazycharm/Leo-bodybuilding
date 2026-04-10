import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminPrograms() {
  const { t, lang } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.programs")}
      entityName="Program"
      entity={entities.Program}
      queryKey="admin-programs"
      columns={[
        { field: "title_en", label: "Title (EN)" },
        { field: "title_ar", label: "Title (AR)" },
        { field: "category", label: lang === "ar" ? "الفئة" : "Category" },
        { field: "is_active", label: t("common.status"), render: (v) => (
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
        { field: "category", label: "Category", type: "select", options: [
          { value: "strength", label: "Strength" },
          { value: "cardio", label: "Cardio" },
          { value: "flexibility", label: "Flexibility" },
          { value: "group", label: "Group" },
          { value: "personal", label: "Personal" },
        ]},
        { field: "gender", label: "Gender", type: "select", options: [
          { value: "all", label: "All" }, { value: "male", label: "Male" }, { value: "female", label: "Female" },
        ]},
        { field: "is_active", label: "Active", type: "boolean" },
        { field: "sort_order", label: "Sort Order", type: "number" },
      ]}
      defaultValues={{ is_active: true, gender: "all", sort_order: 0 }}
    />
  );
}