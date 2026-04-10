import HeroSection from "../components/home/HeroSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import ProgramsPreview from "../components/home/ProgramsPreview";
import HealthPreview from "../components/home/HealthPreview";
import LadiesGentsSection from "../components/home/LadiesGentsSection";
import TrainersPreview from "../components/home/TrainersPreview";
import PlansPreview from "../components/home/PlansPreview";
import TestimonialsPreview from "../components/home/TestimonialsPreview";
import GalleryPreview from "../components/home/GalleryPreview";
import ContactSection from "../components/home/ContactSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <ProgramsPreview />
      <HealthPreview />
      <LadiesGentsSection />
      <TrainersPreview />
      <PlansPreview />
      <TestimonialsPreview />
      <GalleryPreview />
      <ContactSection />
    </div>
  );
}