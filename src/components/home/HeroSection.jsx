import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage, WHATSAPP_URL } from "../../lib/i18n";
import { HERO_IMAGE } from "@/lib/assets";

const HERO_IMG = HERO_IMAGE;

export default function HeroSection() {
  const { t, isRTL, lang } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="LEO Gym" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-6 animate-fade-up">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-medium tracking-wider">
              {lang === "ar" ? "نادي متميز في عجمان" : "PREMIUM FITNESS IN AJMAN"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black leading-[0.9] mb-2 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">{t("hero.title")}</span>
            <br />
            <span className="text-gold-gradient">{t("hero.title2")}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-base md:text-xl max-w-xl mt-6 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all text-sm tracking-wider group"
            >
              {t("hero.cta1")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-green-500/50 text-green-400 font-bold rounded-lg hover:bg-green-500/10 transition-all text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {t("hero.cta2")}
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 md:gap-10 mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { num: "500+", label: lang === "ar" ? "عضو نشط" : "Active Members" },
              { num: "15+", label: lang === "ar" ? "مدرب معتمد" : "Certified Trainers" },
              { num: "10+", label: lang === "ar" ? "سنوات خبرة" : "Years Experience" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-heading font-black text-primary">{stat.num}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}