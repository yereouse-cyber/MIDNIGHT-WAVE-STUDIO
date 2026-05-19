import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mic2, Speaker, Cpu, ChevronLeft, ChevronRight } from "lucide-react";
import { useStudioData } from "@/hooks/useStudioData";
import { motion, AnimatePresence } from "motion/react";

interface EquipmentCategory {
  id: string;
  name: string;
  items: string[];
}

const ICON_MAP: Record<string, any> = {
  "마이크": Mic2,
  "스피커 & 헤드폰": Speaker,
  "아날로그 하드웨어": Cpu,
};

export default function Equipment() {
  const { data: equipmentData, loading } = useStudioData<EquipmentCategory[]>("equipment");
  const { data: studioData } = useStudioData<{ photos: string[] }>("settings/studio", true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const studioImages = studioData?.photos || [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1520529011850-be19655968ff?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1557124816-e9b7d5440de2?auto=format&fit=crop&w=1280&q=80"
  ];

  const gearData: EquipmentCategory[] = [
    {
      id: "monitors",
      name: "Monitors",
      items: ["Amphion Two 15", "ADAM S3V", "Shure 440", "Shure 840", "Slate digital VSX"]
    },
    {
      id: "microphones",
      name: "Microphones",
      items: ["Neumann U87ai", "UAD Shere DLX"]
    },
    {
      id: "interface",
      name: "Audio Interface",
      items: ["UAD Apollo 8 & 16"]
    },
    {
      id: "outboard",
      name: "Outboard",
      items: [
        "Neve Shelford Channel Strip",
        "Neve 8816 Summing Mixer",
        "Klard Teknik DN-780 Reverb",
        "Orban 418a Limiter",
        "AMEK 9098 Comp/Limiter",
        "ORAM Sonics Hi-Def 35 EQ"
      ]
    }
  ];

  const nextSlide = () => {
    if (currentIndex < studioImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div id="equipment" className="py-24 border-b border-studio-border">
      {/* Studio Header & Image Gallery */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 mb-24">
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-16">Studio</h2>
        
        <div className="relative">
          {/* Custom Navigation Buttons - Overlaid */}
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all disabled:opacity-0 pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={currentIndex >= (isMobile ? studioImages.length - 1 : studioImages.length - 2)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all disabled:opacity-0 pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-6"
              animate={{ x: isMobile ? `-${currentIndex * (300 + 24)}px` : `-${currentIndex * (500 + 24)}px` }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
            >
              {studioImages.map((src, i) => (
                <div 
                  key={i} 
                  className="w-[300px] h-[180px] md:w-[500px] md:h-[300px] shrink-0 bg-white/5 overflow-hidden archive-border grayscale hover:grayscale-0 transition-all duration-700"
                >
                  <img 
                    src={src} 
                    alt={`Studio Interior ${i + 1}`} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gear Section */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-12">Gear</h2>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-2">
        {gearData.map((cat) => {
          const Icon = cat.name.includes("Microphone") ? Mic2 : 
                     cat.name.includes("Monitor") ? Speaker : 
                     cat.name.includes("Interface") ? Cpu : Cpu;
          return (
            <div key={cat.id} className="p-8 border border-white/5 group hover:bg-white/[0.02] transition-colors border-collapse">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[20px] font-bold uppercase tracking-[0.2em] text-white group-hover:text-white transition-colors">{cat.name}</h3>
                <Icon className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
              </div>
              <ul className="space-y-3">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex justify-between items-end gap-3 group/item">
                    <span className="text-[17px] text-[#e1e1e1] font-light tracking-tight group-hover/item:text-white transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
