import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminPlans() {
  const { t, lang } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.plans")}
      entityName="MembershipPlan"
      entity={entities.MembershipPlan}
      queryKey="admin-plans"
      columns={[
        { field: "title_en", label: "Title (EN)" },
        { field: "price", label: lang === "ar" ? "السعر" : "Price (AED)" },
        { field: "duration_months", label: lang === "ar" ? "المدة" : "Duration" },
        { field: "is_popular", label: lang === "ar" ? "شائع" : "Popular", render: (v) => v ? "⭐" : "" },
        { field: "is_active", label: "Status", render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{v ? "Active" : "Inactive"}</span>
        )},
      ]}
      formFields={[
        { field: "title_en", label: "Title (English)" },
        { field: "title_ar", label: "Title (Arabic)" },
        { field: "description_en", label: "Description (English)", type: "textarea" },
        { field: "description_ar", label: "Description (Arabic)", type: "textarea" },
        { field: "price", label: "Price (AED)", type: "number" },
        { field: "duration_months", label: "Duration (Months)", type: "number" },
        { field: "features_en", label: "Features (English)", type: "array" },
        { field: "features_ar", label: "Features (Arabic)", type: "array" },
        { field: "gender", label: "Gender", type: "select", options: [
          { value: "all", label: "All" }, { value: "male", label: "Male" }, { value: "female", label: "Female" },
        ]},
        { field: "is_popular", label: "Popular Plan", type: "boolean" },
        { field: "is_active", label: "Active", type: "boolean" },
        { field: "sort_order", label: "Sort Order", type: "number" },
      ]}
      defaultValues={{ is_active: true, is_popular: false, gender: "all", sort_order: 0 }}
    />
  );
}