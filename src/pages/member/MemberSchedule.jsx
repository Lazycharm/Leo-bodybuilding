import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { entities } from "@/api/appClient";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "../../lib/i18n";

export default function MemberSchedule() {
  const { user } = useAuth();
  const { lang, localizedField, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedules = [] } = useQuery({
    queryKey: ["member-schedules"],
    queryFn: () => entities.ClassSchedule.filter({ is_active: true }, "day_of_week", 100),
  });

  const handleBookClass = async (schedule) => {
    if (!user?.id) return;

    try {
      await entities.Booking.create({
        user_id: user.id,
        user_email: user.email,
        class_id: schedule.id,
        class_name: localizedField(schedule, "class_name"),
        date: new Date().toISOString().slice(0, 10),
        status: "pending",
      });

      queryClient.invalidateQueries({ queryKey: ["member-bookings-summary", user.id] });
      toast({ title: lang === "ar" ? "تم إرسال طلب الحجز" : "Booking request sent" });
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر الحجز" : "Unable to book class",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-foreground">{t("member.schedule")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lang === "ar" ? "اطلع على الحصص المتاحة واطلب حجزك القادم." : "Browse active classes and request your next booking."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-heading text-lg font-bold text-foreground">{localizedField(schedule, "class_name")}</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {schedule.day_of_week}
                </span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{lang === "ar" ? "الوقت" : "Time"}: <span className="text-foreground">{schedule.start_time} - {schedule.end_time}</span></p>
                <p>{lang === "ar" ? "المكان" : "Location"}: <span className="text-foreground">{localizedField(schedule, "location") || "-"}</span></p>
                <p>{lang === "ar" ? "السعة" : "Capacity"}: <span className="text-foreground">{schedule.capacity || "-"}</span></p>
              </div>

              <button onClick={() => handleBookClass(schedule)} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                {t("cta.book_class")}
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {lang === "ar" ? "لا توجد حصص متاحة حالياً." : "No active classes are available right now."}
          </div>
        )}
      </div>
    </div>
  );
}
