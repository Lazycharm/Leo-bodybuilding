import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminMembers() {
  const { t, lang } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.members")}
      entityName="Membership"
      entity={entities.Membership}
      queryKey="admin-memberships"
      columns={[
        { field: "user_email", label: lang === "ar" ? "البريد" : "Email" },
        { field: "plan_name", label: lang === "ar" ? "الخطة" : "Plan" },
        { field: "status", label: t("common.status"), render: (v) => (
          <span className={`text-xs px-2 py-0.5 rounded-full ${v === "active" ? "bg-green-500/10 text-green-400" : v === "expired" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>{v}</span>
        )},
        { field: "start_date", label: lang === "ar" ? "البداية" : "Start" },
        { field: "end_date", label: lang === "ar" ? "النهاية" : "End" },
      ]}
      formFields={[
        { field: "user_email", label: lang === "ar" ? "بريد المستخدم" : "User Email", type: "email" },
        { field: "plan_id", label: lang === "ar" ? "معرف الخطة" : "Plan ID" },
        { field: "plan_name", label: lang === "ar" ? "اسم الخطة" : "Plan Name" },
        { field: "status", label: t("common.status"), type: "select", options: [
          { value: "active", label: lang === "ar" ? "نشط" : "Active" },
          { value: "expired", label: lang === "ar" ? "منتهي" : "Expired" },
          { value: "pending", label: lang === "ar" ? "معلق" : "Pending" },
          { value: "cancelled", label: lang === "ar" ? "ملغي" : "Cancelled" },
          { value: "frozen", label: lang === "ar" ? "مجمد" : "Frozen" },
        ]},
        { field: "start_date", label: lang === "ar" ? "تاريخ البداية" : "Start Date", type: "date" },
        { field: "end_date", label: lang === "ar" ? "تاريخ النهاية" : "End Date", type: "date" },
        { field: "amount_paid", label: lang === "ar" ? "المبلغ المدفوع" : "Amount Paid (AED)", type: "number" },
        { field: "payment_method", label: lang === "ar" ? "طريقة الدفع" : "Payment Method", type: "select", options: [
          { value: "cash", label: lang === "ar" ? "نقدي" : "Cash" },
          { value: "card", label: lang === "ar" ? "بطاقة" : "Card" },
          { value: "bank_transfer", label: lang === "ar" ? "تحويل بنكي" : "Bank Transfer" },
        ]},
        { field: "notes", label: lang === "ar" ? "ملاحظات" : "Notes", type: "textarea" },
      ]}
      defaultValues={{ status: "pending" }}
    />
  );
}