import { motion } from "motion/react";
import { Mail, Instagram, MapPin } from "lucide-react";
import { useStudioData } from "@/hooks/useStudioData";

interface GeneralInfo {
  introText: string;
  address: string;
  instagramUrl: string;
  email: string;
}

export default function Contact() {
  const { data: studioInfo } = useStudioData<GeneralInfo>("settings/home", true);
  
  const info = studioInfo || {
    address: "서울특별시 양천구 공항대로 552 지하1층 103호",
    instagramUrl: "https://instagram.com/midnightwave_studio",
    email: "kyoungsik@midnightwave.kr"
  };

  const displayEmail = info.email || "kyoungsik@midnightwave.kr";
  const instagramHandle = info.instagramUrl?.split('/').pop() || "midnightwave_studio";

  return (
    <div id="contact" className="py-32 border-b border-studio-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">Contact</h2>
            <p className="text-[#e1e1e1] text-[17px] font-light leading-relaxed max-w-sm uppercase tracking-wide">
              귀하의 프로젝트를 완성하기 위한 첫걸음입니다.<br />
              문의사항은 연락처로 언제든 편하게 말씀해 주세요.
            </p>
          </div>

          <div className="flex flex-col justify-end space-y-16">
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white/20">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Location</span>
                </div>
                <div className="text-xl font-bold uppercase tracking-tight text-white">
                  {info.address || "서울특별시 양천구 공항대로 552 지하1층 103호"}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white/20">
                  <Instagram className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Instagram</span>
                </div>
                <div className="text-xl font-bold lowercase tracking-tight text-white inline-block">
                  @{instagramHandle.startsWith('@') ? instagramHandle.slice(1) : instagramHandle}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white/20">
                  <Mail className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Direct Mail</span>
                </div>
                <div className="text-xl font-bold lowercase tracking-tight text-white inline-block">
                  {displayEmail.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
