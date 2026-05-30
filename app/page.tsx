import Navbar from "@/components/customer/Navbar";
import HeroSection from "@/components/customer/HeroSection";
import StatsBar from "@/components/customer/StatsBar";
import FeaturedMenu from "@/components/customer/FeaturedMenu";
import HowItWorks from "@/components/customer/HowItWorks";
import UrgencyBanner from "@/components/customer/UrgencyBanner";
import Testimonials from "@/components/customer/Testimonials";
import StorySection from "@/components/customer/StorySection";
import BranchesSection from "@/components/customer/BranchesSection";
import Footer from "@/components/customer/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturedMenu />
      <HowItWorks />
      <UrgencyBanner />
      <Testimonials />
      <StorySection />
      <BranchesSection />
      <Footer />
    </main>
  );
}
