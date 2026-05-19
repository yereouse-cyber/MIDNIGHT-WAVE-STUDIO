import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useStudioData } from "@/hooks/useStudioData";

interface PricingItem {
  id: string;
  title: string;
  price: string;
  subtitle?: string;
  description: string;
  order?: number;
}

export default function Pricing() {
  const { loading } = useStudioData<PricingItem>("pricing");

  const pricingCategories: PricingItem[] = [
    {
      id: "mixing",
      title: "Mixing",
      price: "₩ 500,000",
      description: "전문적인 기술을 기반으로 완성도 높은 사운드를 만드는 프로페셔널 믹싱"
    },
    {
      id: "mastering",
      title: "Mastering",
      price: "₩ 100,000",
      description: "릴리즈 환경에 최적화된 최종 음원을 완성하는 마스터링"
    },
    {
      id: "mixing-mastering",
      title: "Mixing + Mastering",
      price: "₩ 600,000",
      description: "최상의 결과물을 제공하는 믹싱 및 마스터링 패키지"
    },
    {
      id: "recording",
      title: "Recording",
      price: "₩ 150,000",
      subtitle: "1프로 (3h 30m)",
      description: "최적의 어쿠스틱 환경에서 진행되는 고음질 레코딩"
    },
    {
      id: "vocal-tuning",
      title: "Vocal Tuning",
      price: "₩ 150,000",
      description: "보컬의 음정과 타이밍을 정교하게 다듬는 작업"
    }
  ];

  return (
    <div id="pricing" className="py-24 border-b border-studio-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Pricing</h2>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
             <div key={i} className="h-64 border border-white/5 animate-pulse" />
          ))
        ) : (
          pricingCategories.map((item) => (
            <div 
              key={item.id} 
              className="p-10 border border-white/5 group hover:bg-white/[0.02] transition-all relative overflow-hidden flex flex-col justify-between min-h-[320px]"
            >
              <div>
                <h3 className="text-[20px] font-bold text-white mb-6 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-4xl font-bold tracking-tighter text-white">
                    {item.price}
                  </div>
                  {item.subtitle && (
                    <span className="text-[15px] uppercase tracking-widest text-[#e1e1e1] font-light">{item.subtitle}</span>
                  )}
                </div>
              </div>
              
              <div className="mt-auto">
                <p className="text-[17px] leading-relaxed text-[#e1e1e1] font-light group-hover:text-white transition-colors whitespace-pre-line">
                  {item.description}
                </p>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-end">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white transition-colors" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
