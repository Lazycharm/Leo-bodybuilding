import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";
import { useLanguage } from "../../lib/i18n";

export default function MemberAnnouncements() {
  const { lang, t } = useLanguage();

  const { data: announcements = [] } = useQuery({
    queryKey: ["member-announcements"],
    queryFn: () => entities.Announcement.filter({ is_active: true }, "-created_at", 50),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-foreground">{t("member.announcements")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lang === "ar" ? "آخر الأخبار والعروض والتنبيهات المهمة من النادي." : "Latest gym news, offers, and important alerts."}
        </p>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {lang === "ar" ? item.title_ar || item.title_en : item.title_en || item.title_ar}
                </h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{item.type}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {lang === "ar" ? item.content_ar || item.content_en : item.content_en || item.content_ar}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {lang === "ar" ? "لا توجد إعلانات حالياً." : "No announcements right now."}
          </div>
        )}
      </div>
    </div>
  );
}
