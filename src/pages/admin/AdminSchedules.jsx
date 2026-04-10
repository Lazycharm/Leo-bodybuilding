import AdminCrudPage from "../../components/admin/AdminCrudPage";
import { useLanguage } from "../../lib/i18n";
import { entities } from "@/api/appClient";

export default function AdminSchedules() {
  const { t, lang } = useLanguage();

  return (
    <AdminCrudPage
      title={t("admin.schedules")}
      entityName="ClassSchedule"
      entity={entities.ClassSchedule}
      queryKey="admin-schedules"
      columns={[
        { field: "class_name_en", label: "Class (EN)" },
        { field: "day_of_week", label: lang === "ar" ? "اليوم" : "Day" },
        { field: "start_time", label: lang === "ar" ? "البداية" : "Start" },
        { field: "end_time", label: lang === "ar" ? "النهاية" : "End" },
        { field: "gender", label: lang === "ar" ? "الجنس" : "Gender" },
      ]}
      formFields={[
        { field: "class_name_en", label: "Class Name (English)" },
        { field: "class_name_ar", label: "Class Name (Arabic)" },
        { field: "day_of_week", label: "Day", type: "select", options: [
          { value: "monday", label: "Monday" }, { value: "tuesday", label: "Tuesday" },
          { value: "wednesday", label: "Wednesday" }, { value: "thursday", label: "Thursday" },
          { value: "friday", label: "Friday" }, { value: "saturday", label: "Saturday" },
          { value: "sunday", label: "Sunday" },
        ]},
        { field: "start_time", label: "Start Time (e.g. 09:00)" },
        { field: "end_time", label: "End Time (e.g. 10:00)" },
        { field: "capacity", label: "Capacity", type: "number" },
        { field: "gender", label: "Gender", type: "select", options: [
          { value: "all", label: "All" }, { value: "male", label: "Male" }, { value: "female", label: "Female" },
        ]},
        { field: "location_en", label: "Location (English)" },
        { field: "location_ar", label: "Location (Arabic)" },
        { field: "is_active", label: "Active", type: "boolean" },
      ]}
      defaultValues={{ is_active: true, gender: "all", capacity: 20 }}
    />
  );
}