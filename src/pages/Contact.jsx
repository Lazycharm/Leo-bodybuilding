import ContactSection from "../components/home/ContactSection";
import { useLanguage } from "../lib/i18n";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-16">
      <ContactSection />
    </div>
  );
}