import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function WorkflowAdmin() {
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "workflow"));
      const fetchedSteps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (fetchedSteps.length === 0) {
        setSteps([
          {
            id: "1",
            stepNumber: 1,
            title: "스케줄 조율",
            description: "희망 마간일/연락처/작업 방식(녹음/튠/믹스/마스터) 등을 확인합니다.\n믹싱 작업의 경우 STEM 또는 Multi Track 파일 전달 여부를 함께 확인합니다."
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
        ]);
      } else {
        setSteps((fetchedSteps as any[]).sort((a, b) => a.stepNumber - b.stepNumber));
      }
    }
    fetchData();
  }, []);

  const addStep = () => {
    const nextNum = steps.length + 1;
    setSteps([...steps, { id: `temp-${Date.now()}`, stepNumber: nextNum, title: "", description: "" }]);
  };

  const removeStep = async (id: string) => {
    if (!id.toString().startsWith("temp-")) {
      await deleteDoc(doc(db, "workflow", id));
    }
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    try {
      for (const step of steps) {
        const { id, ...rest } = step;
        if (id.toString().startsWith("temp-")) {
          await addDoc(collection(db, "workflow"), rest);
        } else {
          await setDoc(doc(db, "workflow", id), rest);
        }
      }
      toast.success("작업 안내가 저장되었습니다.");
      const querySnapshot = await getDocs(collection(db, "workflow"));
      setSteps(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      console.error("Workflow save error:", e);
      toast.error(`작업 안내 저장에 실패했습니다: ${e.message || e.toString()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white">Production Process Management</h2>
        <Button onClick={addStep} variant="outline" className="border-white/10 hover:bg-white hover:text-black rounded-none h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
          <Plus className="w-4 h-4 mr-2" /> Add Step
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <Card key={step.id} className="bg-studio-black border-white/10 rounded-none">
            <CardContent className="pt-6">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center text-xl font-bold shrink-0 text-white">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-white">Step Title</Label>
                      <Input 
                        value={step.title} 
                        onChange={(e) => setSteps(steps.map(s => s.id === step.id ? { ...s, title: e.target.value } : s))}
                        className="bg-white/5 border-white/10 rounded-none text-white text-[13px]"
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)} className="text-white hover:text-red-500 mt-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white">Detailed Description</Label>
                    <Textarea 
                      value={step.description} 
                      onChange={(e) => setSteps(steps.map(s => s.id === step.id ? { ...s, description: e.target.value } : s))}
                      className="bg-white/5 border-white/10 h-24 rounded-none text-white text-[13px] leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-white/90 py-6 rounded-none font-bold uppercase tracking-widest">
        <Save className="w-4 h-4 mr-2" /> Save Process Database
      </Button>
    </div>
  );
}
