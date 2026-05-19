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

export default function FAQAdmin() {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "faq"));
      const fetchedFaqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (fetchedFaqs.length === 0) {
        setFaqs([
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
        ]);
      } else {
        setFaqs((fetchedFaqs as any[]).sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    }
    fetchData();
  }, []);

  const addFaq = () => {
    setFaqs([...faqs, { id: `temp-${Date.now()}`, question: "", answer: "", order: faqs.length }]);
  };

  const removeFaq = async (id: string) => {
    if (!id.toString().startsWith("temp-")) {
      await deleteDoc(doc(db, "faq", id));
    }
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleSave = async () => {
    try {
      for (const item of faqs) {
        const { id, ...rest } = item;
        if (id.toString().startsWith("temp-")) {
          await addDoc(collection(db, "faq"), rest);
        } else {
          await setDoc(doc(db, "faq", id), rest);
        }
      }
      toast.success("FAQ가 저장되었습니다.");
      const querySnapshot = await getDocs(collection(db, "faq"));
      setFaqs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      console.error("FAQ save error:", e);
      toast.error(`FAQ 저장에 실패했습니다: ${e.message || e.toString()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white">FAQ Management</h2>
        <Button onClick={addFaq} variant="outline" className="border-white/10 hover:bg-white hover:text-black rounded-none h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
          <Plus className="w-4 h-4 mr-2" /> Add Entry
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <Card key={item.id} className="bg-studio-black border-white/10 rounded-none">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white">Question</Label>
                    <Input 
                      value={item.question} 
                      onChange={(e) => setFaqs(faqs.map(f => f.id === item.id ? { ...f, question: e.target.value } : f))}
                      className="bg-white/5 border-white/10 rounded-none text-white text-[13px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-white">Answer</Label>
                    <Textarea 
                      value={item.answer} 
                      onChange={(e) => setFaqs(faqs.map(f => f.id === item.id ? { ...f, answer: e.target.value } : f))}
                      className="bg-white/5 border-white/10 h-32 rounded-none text-white text-[13px] leading-relaxed"
                    />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFaq(item.id)} className="text-white hover:text-red-500 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-white/90 py-6 rounded-none font-bold uppercase tracking-widest">
        <Save className="w-4 h-4 mr-2" /> Save Assistance Database
      </Button>
    </div>
  );
}
