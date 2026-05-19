import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudioData } from "@/hooks/useStudioData";

interface PortfolioItem {
  id: string;
  artistName: string;
  songTitle: string;
  youtubeId: string;
  genre: string;
  category: string;
}

const CATEGORIES = ["ALL", "K-POP", "HIP-HOP", "R&B", "POP"];

export default function Portfolio() {
  const [filter, setFilter] = useState("ALL");
  const [showAll, setShowAll] = useState(false);
  const { data: portfolioItems, loading } = useStudioData<PortfolioItem>("portfolio");

  const filteredItems = (portfolioItems || []).filter(
    item => filter === "ALL" || item.category === filter
  );

  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  return (
    <div id="portfolio" className="py-24 border-b border-studio-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Discography</h2>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 md:px-12 font-sans">
        {loading ? (
          <div className="text-center py-24 text-white/10 text-xs uppercase tracking-widest font-medium">Loading Archive...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
            <AnimatePresence mode="popLayout">
              {displayItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative aspect-video bg-black archive-border overflow-hidden mb-6 group-hover:border-white/20 transition-colors">
                    <iframe
                      className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity"
                      src={`https://www.youtube.com/embed/${item.youtubeId}`}
                      title={`${item.artistName} - ${item.songTitle}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-bold uppercase tracking-tight text-white leading-tight">
                      {item.artistName} - {item.songTitle}
                    </h3>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                      {item.genre}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!showAll && filteredItems.length > 8 && (
          <div className="mt-20 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAll(true)}
              className="rounded-none border-white/10 text-[10px] uppercase tracking-[0.3em] h-12 px-12 group hover:bg-white hover:text-black transition-all"
            >
              더보기
              <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
