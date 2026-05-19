import { motion } from "motion/react";
import { Instagram, MapPin } from "lucide-react";
import { useStudioData } from "@/hooks/useStudioData";

interface HomeSettings {
  introText: string;
  address: string;
  instagramUrl: string;
  heroImageDesktop?: string;
  heroImageMobile?: string;
  heroImage?: string; // For backward compatibility
}

export default function Hero() {
  const { data, loading } = useStudioData<HomeSettings>("settings/home", true);

  const introText = data?.introText || "미드나잇웨이브 스튜디오는 아티스트가 가장 편안한 상태로 자신의 음악에 몰입할 수 있는 작업 환경을 만드는 것을 중요하게 생각합니다. 작은 디테일 하나까지 세심하게 고민하며, 녹음부터 믹싱, 마스터링까지 모든 과정에서 최고의 결과물을 약속드립니다. 언제든 편하게 문의해주세요. 감사합니다.";
  const address = data?.address || "서울특별시 양천구 공항대로 552 지하1층 103호";
  const instagramUrl = data?.instagramUrl || "https://instagram.com";
  
  const heroImageDesktop = data?.heroImageDesktop || data?.heroImage;
  const heroImageMobile = data?.heroImageMobile || data?.heroImage;

  return (
    <div id="home" className="relative transition-all duration-1000 min-h-[90vh] flex flex-col justify-end border-b border-studio-border">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {/* Desktop Image */}
        {heroImageDesktop && (
          <img 
            src={heroImageDesktop} 
            alt="Studio Background Desktop" 
            className="hidden md:block w-full h-full object-cover opacity-50 select-none pointer-events-none"
          />
        )}
        {/* Mobile Image */}
        {heroImageMobile && (
          <img 
            src={heroImageMobile} 
            alt="Studio Background Mobile" 
            className="block md:hidden w-full h-full object-cover opacity-50 select-none pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-studio-black via-studio-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-studio-black/20 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 md:px-12 relative z-10 w-full pt-40 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-[66px]"
        >
          <p className="text-[#e1e1e1] text-[17px] font-light leading-relaxed w-full break-keep mt-[190px] max-w-[75ch]">
            {introText}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-16 md:items-end justify-start"
        >
          <div className="space-y-4">
            <div className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Location</div>
            <div className="flex items-start gap-3 text-white text-[15px] font-bold uppercase tracking-tight max-w-sm">
              <MapPin className="w-5 h-5 text-white/20 mt-1 shrink-0" />
              <span>{address}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Instagram</div>
            <div className="flex items-center gap-3 text-white text-[15px] font-bold lowercase tracking-tight">
              <Instagram className="w-5 h-5 text-white/20 shrink-0" />
              <span>@midnightwave_studio</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
