import { useState } from "react";
import { useLanguage, WHATSAPP_URL, PHONE_NUMBER, GYM_EMAIL, GOOGLE_MAPS_URL } from "../../lib/i18n";
import SectionHeader from "../public/SectionHeader";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { entities } from "@/api/appClient";
import { useToast } from "@/components/ui/use-toast";

export default function ContactSection() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await entities.Inquiry.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        type: "general",
        source: "website",
      });

      toast({ title: lang === "ar" ? "تم الإرسال بنجاح" : "Message sent successfully!" });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر إرسال الرسالة" : "Unable to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: PHONE_NUMBER, href: `tel:${PHONE_NUMBER}` },
    { icon: Mail, label: GYM_EMAIL, href: `mailto:${GYM_EMAIL}` },
    { icon: MapPin, label: t("contact.address"), href: GOOGLE_MAPS_URL },
    { icon: Clock, label: t("contact.hours"), href: null },
    { icon: MessageCircle, label: t("cta.whatsapp"), href: WHATSAPP_URL, green: true },
  ];

  return (
    <section className="py-16 md:py-24 px-4" id="contact">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={t("section.contact")}
          subtitle={t("section.contact_sub")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <div className={`flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-all ${item.green ? "text-green-400" : "text-muted-foreground"}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.green ? "bg-green-500/10" : "bg-primary/10"}`}>
                    <Icon className={`w-5 h-5 ${item.green ? "text-green-400" : "text-primary"}`} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
              return item.href ? (
                <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-4">
            <input
              type="text"
              placeholder={t("contact.name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:border-primary focus:outline-none transition-colors"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder={t("contact.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:border-primary focus:outline-none transition-colors"
              />
              <input
                type="tel"
                placeholder={t("contact.phone")}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <textarea
              placeholder={t("contact.message")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              required
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:border-primary focus:outline-none transition-colors resize-none"
            />
            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider"
            >
              <Send className="w-4 h-4 me-2" />
              {sending ? t("common.loading") : t("cta.send")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}