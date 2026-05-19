import { motion } from "motion/react";
import { useStudioData } from "@/hooks/useStudioData";

interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}

export default function Workflow() {
  const { loading } = useStudioData<WorkflowStep>("workflow");

  const workflowSteps: WorkflowStep[] = [
    {
      id: "1",
      stepNumber: 1,
      title: "스케줄 조율",
      description: "희망 마감일/연락처/작업 방식(녹음/튠/믹스/마스터) 등을 확인합니다.\n믹싱 작업의 경우 STEM 또는 Multi Track 파일 전달 여부를 함께 확인합니다."
    },
    {
      id: "2",
      stepNumber: 2,
      title: "자료 확인",
      description: "전달해주신 트랙 파일/시작점/가이드 및 레퍼런스 음원등을 확인합니다.\n파일 누락이나 추가로 필요한 자료가 있을 경우 별도로 안내드립니다."
    },
    {
      id: "3",
      stepNumber: 3,
      title: "1차본 전달",
      description: "작업 시작일 기준 보통 2~3일 내 1차 믹스본을 전달드립니다.\n트랙 수, 튠 작업 여부, 작업 난이도에 따라 일정은 조금 달라질 수 있습니다."
    },
    {
      id: "4",
      stepNumber: 4,
      title: "수정 진행",
      description: "전달드린 1차본을 확인하신 후 피드백을 보내주시면 수정 작업을 진행합니다.\n수정은 최대 7회까지 가능합니다. 이후에는 추가금이 발생할 수 있습니다."
    },
    {
      id: "5",
      stepNumber: 5,
      title: "최종 확정 및 납품",
      description: "최종본 확정 후 WAV, MP3 등 필요한 형식으로 파일을 전달드립니다.\n마스터링 포함 작업의 경우 최종 마스터 음원까지 함께 납품됩니다."
    }
  ];

  return (
    <div id="workflow" className="py-24 border-b border-studio-border">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 mb-24">
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Process</h2>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        {loading ? (
          <div className="text-center py-12 text-white/10 font-bold uppercase tracking-widest text-[10px]">Loading workflow...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {workflowSteps.map((step, idx) => (
              <motion.div 
                key={step.id} 
                className="p-12 flex flex-col justify-between h-[400px] border border-white/5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-12">Step / {step.stepNumber.toString().padStart(2, '0')}</div>
                  <h3 className="text-[20px] font-bold uppercase tracking-tighter mb-6 text-white">{step.title}</h3>
                </div>
                
                <p className="text-[17px] text-[#e1e1e1] font-light leading-relaxed whitespace-pre-line group-hover:text-white transition-colors">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
