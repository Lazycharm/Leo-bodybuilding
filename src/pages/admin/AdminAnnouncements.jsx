import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminAnnouncements() {
  const { t, lang } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.announcements")}
      entityName="Announcement"
      entity={entities.Announcement}
      queryKey="admin-announcements"
      columns={[
        { field: "title_en", label: "Title (EN)" },
        { field: "type", label: lang === "ar" ? "النوع" : "Type" },
        { field: "target_audience", label: lang === "ar" ? "الجمهور" : "Audience" },
        { field: "is_active", label: "Status", render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{v ? "Active" : "Inactive"}</span>
        )},
      ]}
      formFields={[
        { field: "title_en", label: "Title (English)" },
        { field: "title_ar", label: "Title (Arabic)" },
        { field: "content_en", label: "Content (English)", type: "textarea" },
        { field: "content_ar", label: "Content (Arabic)", type: "textarea" },
        { field: "type", label: "Type", type: "select", options: [
          { value: "general", label: "General" },
          { value: "offer", label: "Offer" },
          { value: "event", label: "Event" },
          { value: "maintenance", label: "Maintenance" },
          { value: "urgent", label: "Urgent" },
        ]},
        { field: "target_audience", label: "Target Audience", type: "select", options: [
          { value: "all", label: "All" },
          { value: "members", label: "Members" },
          { value: "visitors", label: "Visitors" },
        ]},
        { field: "is_active", label: "Active", type: "boolean" },
      ]}
      defaultValues={{ is_active: true, type: "general", target_audience: "all" }}
    />
  );
}