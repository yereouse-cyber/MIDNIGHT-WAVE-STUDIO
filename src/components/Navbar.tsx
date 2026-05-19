import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Music2 } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { name: "Discography", path: "portfolio" },
    { name: "Studio", path: "equipment" },
    { name: "Pricing", path: "pricing" },
    { name: "FAQ", path: "faq" },
    { name: "Process", path: "workflow" },
    { name: "Contact", path: "contact" },
  ];

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = "/#" + id;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-studio-black/80 backdrop-blur-sm border-b border-studio-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 h-20 md:h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display font-bold tracking-tighter text-2xl uppercase text-white">MIDNIGHT WAVE STUDIO</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => scrollToSection("home")}
            className="text-[11px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer uppercase tracking-[0.2em]"
          >
            Home
          </button>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => scrollToSection(item.path)}
              className="text-[11px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer uppercase tracking-[0.2em]"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
