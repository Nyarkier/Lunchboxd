import AboutSection from "../components/Home/About";
import { Hero } from "../components/Home/Hero";
import TeamSection from "../components/Home/Team";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";

export function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <AboutSection />
      <TeamSection />
      <Footer />
    </>
  );
}
