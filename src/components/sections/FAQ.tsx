import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStudioData } from "@/hooks/useStudioData";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

export default function FAQ() {
  const { data: faqData, loading } = useStudioData<FAQItem>("faq");

  const faqListData: FAQItem[] = [
    {
      id: "q1",
      question: "Q. 1차본은 언제 받을 수 있나요?",
      answer: "1곡 기준으로 평균 2~3일 후 1차 믹스본을 전달드립니다.\n트랙 수, 튠 작업 여부, 수정 범위 등에 따라 일정이 조금 달라질 수 있습니다.",
      order: 1
    },
    {
      id: "q2",
      question: "Q. 수정은 몇 회까지 가능한가요?",
      answer: "수정은 최대 7회입니다.\n다만, 수정 과정에서 트랙 파일을 교체하거나 새로운 파일이 추가되는 경우에는 추가 요금이 발생할 수 있습니다.",
      order: 2
    },
    {
      id: "q3",
      question: "Q. 오프라인 믹싱도 가능한가요?",
      answer: "가능합니다. 최소 3일 전 일정 조율 후 진행 가능합니다.\n주차도 가능하며, 2시간 무료 주차가 제공됩니다.",
      order: 3
    },
    {
      id: "q4",
      question: "Q. 파일은 어떻게 전달하면 될까요?",
      answer: "48kHz, 24bit WAV 형식의 오디오 파일을 권장합니다.",
      order: 4
    },
    {
      id: "q5",
      question: "[파일 전달 전 체크리스트]",
      answer: "* 파일 형식은 48kHz / 24bit / WAV 권장\n* 원래 모노 트랙은 모노로, 스테레오 트랙은 스테레오로 추출\n* 모든 트랙은 같은 시작 지점에서 추출\n* 왼쪽/오른쪽 배치가 있는 트랙 파일명에 패닝값 표시 ex)Guitar_L30.wav)\n* 트랙 이름은 악기나 역할을 알 수 있게 정리 ex)Hat, Main, Bass\n* 레퍼런스 음원이 있다면 함께 전달\n*BPM 기입 필수\n\n마스터링 작업의 경우에는 최종 믹스 파일 1개와 레퍼런스 음원을 함께 보내주시면 됩니다.\n마스터링 전 믹스 파일은 과도한 리미터나 클리핑 없이 전달해주세요.",
      order: 5
    }
  ];

  return (
    <div id="faq" className="py-24 border-b border-studio-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr,2.5fr] gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">FAQ</h2>
        </div>

        <div>
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-16 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-0">
              {faqListData.map((item) => (
                <AccordionItem 
                  key={item.id} 
                  value={item.id}
                  className="border-b border-white/5 px-0 first:border-t"
                >
                  <AccordionTrigger className="text-left py-8 hover:no-underline font-bold uppercase tracking-tight text-white hover:text-white transition-colors group">
                    <div className="flex items-start gap-6">
                      <span className="text-white/10 group-hover:text-white/30 transition-colors font-mono">0{item.order || 1}</span>
                      <span className="text-[20px]">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e1e1e1] font-light leading-relaxed pb-12 pl-12 text-[17px] max-w-3xl">
                    <div className="whitespace-pre-line">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
