import Hero from "@/components/sections/Hero";
import Portfolio from "@/components/sections/Portfolio";
import Equipment from "@/components/sections/Equipment";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Workflow from "@/components/sections/Workflow";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Portfolio />
      <Equipment />
      <Pricing />
      <FAQ />
      <Workflow />
      <Contact />
    </main>
  );
}
