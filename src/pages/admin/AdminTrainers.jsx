import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminTrainers() {
  const { t, lang } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.trainers")}
      entityName="Trainer"
      entity={entities.Trainer}
      queryKey="admin-trainers"
      columns={[
        { field: "name_en", label: lang === "ar" ? "الاسم (إنجليزي)" : "Name (EN)" },
        { field: "name_ar", label: lang === "ar" ? "الاسم (عربي)" : "Name (AR)" },
        { field: "title_en", label: lang === "ar" ? "اللقب" : "Title" },
        { field: "gender", label: lang === "ar" ? "الجنس" : "Gender" },
        { field: "is_active", label: t("common.status"), render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{v ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "غير نشط" : "Inactive")}</span>
        )},
      ]}
      formFields={[
        { field: "name_en", label: "Name (English)" },
        { field: "name_ar", label: "Name (Arabic)" },
        { field: "title_en", label: "Title (English)" },
        { field: "title_ar", label: "Title (Arabic)" },
        { field: "bio_en", label: "Bio (English)", type: "textarea" },
        { field: "bio_ar", label: "Bio (Arabic)", type: "textarea" },
        { field: "specialties_en", label: "Specialties (English)", type: "array" },
        { field: "specialties_ar", label: "Specialties (Arabic)", type: "array" },
        { field: "photo_url", label: "Photo URL" },
        { field: "gender", label: "Gender", type: "select", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
        { field: "experience_years", label: "Years of Experience", type: "number" },
        { field: "certifications", label: "Certifications", type: "array" },
        { field: "is_active", label: "Active", type: "boolean" },
        { field: "sort_order", label: "Sort Order", type: "number" },
      ]}
      defaultValues={{ is_active: true, sort_order: 0 }}
    />
  );
}