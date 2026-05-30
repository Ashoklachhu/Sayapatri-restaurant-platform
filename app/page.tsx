import Navbar from "@/components/customer/Navbar";
import HeroSection from "@/components/customer/HeroSection";
import FeaturedMenu from "@/components/customer/FeaturedMenu";
import StorySection from "@/components/customer/StorySection";
import BranchesSection from "@/components/customer/BranchesSection";
import UrgencyBanner from "@/components/customer/UrgencyBanner";
import Footer from "@/components/customer/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedMenu />
      <UrgencyBanner />
      <StorySection />
      <BranchesSection />
      <Footer />
    </main>
  );
}
