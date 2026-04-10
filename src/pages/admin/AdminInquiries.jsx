import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminInquiries() {
  const { t, lang } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.inquiries")}
      entityName="Inquiry"
      entity={entities.Inquiry}
      queryKey="admin-inquiries"
      sortField="-created_date"
      columns={[
        { field: "name", label: lang === "ar" ? "الاسم" : "Name" },
        { field: "email", label: lang === "ar" ? "البريد" : "Email" },
        { field: "phone", label: lang === "ar" ? "الهاتف" : "Phone" },
        { field: "type", label: lang === "ar" ? "النوع" : "Type" },
        { field: "status", label: t("common.status"), render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            v === "new" ? "bg-yellow-500/10 text-yellow-400" :
            v === "contacted" ? "bg-blue-500/10 text-blue-400" :
            v === "resolved" ? "bg-green-500/10 text-green-400" :
            "bg-muted text-muted-foreground"
          }`}>{v}</span>
        )},
        { field: "created_date", label: lang === "ar" ? "التاريخ" : "Date", render: (v) => v ? new Date(v).toLocaleDateString() : "" },
      ]}
      formFields={[
        { field: "name", label: lang === "ar" ? "الاسم" : "Full Name" },
        { field: "email", label: lang === "ar" ? "البريد" : "Email" },
        { field: "phone", label: lang === "ar" ? "الهاتف" : "Phone" },
        { field: "type", label: lang === "ar" ? "النوع" : "Type", type: "select", options: [
          { value: "general", label: "General" },
          { value: "membership", label: "Membership" },
          { value: "trial", label: "Free Trial" },
          { value: "booking", label: "Booking" },
          { value: "complaint", label: "Complaint" },
          { value: "upgrade", label: "Upgrade" },
        ]},
        { field: "message", label: lang === "ar" ? "الرسالة" : "Message", type: "textarea" },
        { field: "status", label: t("common.status"), type: "select", options: [
          { value: "new", label: "New" },
          { value: "contacted", label: "Contacted" },
          { value: "resolved", label: "Resolved" },
          { value: "closed", label: "Closed" },
        ]},
        { field: "source", label: lang === "ar" ? "المصدر" : "Source", type: "select", options: [
          { value: "website", label: "Website" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "walk-in", label: "Walk-in" },
          { value: "referral", label: "Referral" },
          { value: "social", label: "Social Media" },
        ]},
        { field: "admin_notes", label: lang === "ar" ? "ملاحظات المدير" : "Admin Notes", type: "textarea" },
      ]}
      defaultValues={{ status: "new", type: "general", source: "website" }}
    />
  );
}