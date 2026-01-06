import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FamilyTreeSection } from "@/components/FamilyTreeSection";
import { PhotoAlbumsSection } from "@/components/PhotoAlbumsSection";
import { AudioMemoriesSection } from "@/components/AudioMemoriesSection";
import { QuizSection } from "@/components/QuizSection";
import { BirthdaysSection } from "@/components/BirthdaysSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FamilyTreeSection />
        <PhotoAlbumsSection />
        <AudioMemoriesSection />
        <QuizSection />
        <BirthdaysSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
