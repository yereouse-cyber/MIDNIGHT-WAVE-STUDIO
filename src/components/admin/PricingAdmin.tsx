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

export default function PricingAdmin() {
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "pricing"));
      const fetchedPrices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (fetchedPrices.length === 0) {
        setPrices([
          { id: "mixing", title: "Mixing", price: "₩ 500,000", description: "전문적인 기술을 기반으로 완성도 높은 사운드를 만드는 프로페셔널 믹싱", order: 0 },
          { id: "mastering", title: "Mastering", price: "₩ 100,000", description: "릴리즈 환경에 최적화된 최종 음원을 완성하는 마스터링", order: 1 },
          { id: "mixing-mastering", title: "Mixing + Mastering", price: "₩ 600,000", description: "최상의 결과물을 제공하는 믹싱 및 마스터링 패키지", order: 2 },
          { id: "recording", title: "Recording", price: "₩ 150,000", subtitle: "1프로 (3h 30m)", description: "최적의 어쿠스틱 환경에서 진행되는 고음질 레코딩", order: 3 },
          { id: "vocal-tuning", title: "Vocal Tuning", price: "₩ 150,000", description: "보컬의 음정과 타이밍을 정교하게 다듬는 작업", order: 4 }
        ]);
      } else {
        setPrices((fetchedPrices as any[]).sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    }
    fetchData();
  }, []);

  const addCard = () => {
    setPrices([...prices, { id: `temp-${Date.now()}`, title: "", price: "", description: "", order: prices.length }]);
  };

  const removeCard = async (id: string) => {
    if (!id.toString().startsWith("temp-")) {
      await deleteDoc(doc(db, "pricing", id));
    }
    setPrices(prices.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    try {
      for (const item of prices) {
        const { id, ...rest } = item;
        if (id.toString().startsWith("temp-")) {
          await addDoc(collection(db, "pricing"), rest);
        } else {
          await setDoc(doc(db, "pricing", id), rest);
        }
      }
      toast.success("가격 정보가 저장되었습니다.");
      const querySnapshot = await getDocs(collection(db, "pricing"));
      setPrices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      console.error("Pricing save error:", e);
      toast.error(`가격 정보 저장에 실패했습니다: ${e.message || e.toString()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white">Pricing Tier Management</h2>
        <Button onClick={addCard} variant="outline" className="border-white/10 hover:bg-white hover:text-black rounded-none h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
          <Plus className="w-4 h-4 mr-2" /> Add Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prices.map((item) => (
          <Card key={item.id} className="bg-studio-black border-white/10 rounded-none overflow-hidden group">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <Label className="text-[10px] uppercase tracking-widest text-white">Card ID: {item.id.toString().slice(0, 8)}</Label>
                <Button variant="ghost" size="icon" onClick={() => removeCard(item.id)} className="text-white hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white">Service Title</Label>
                <Input 
                  value={item.title} 
                  onChange={(e) => setPrices(prices.map(p => p.id === item.id ? { ...p, title: e.target.value } : p))}
                  className="bg-white/5 border-white/10 rounded-none text-white text-[13px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white">Rate</Label>
                <Input 
                  value={item.price} 
                  onChange={(e) => setPrices(prices.map(p => p.id === item.id ? { ...p, price: e.target.value } : p))}
                  className="bg-white/5 border-white/10 rounded-none text-white text-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white">Details</Label>
                <Textarea 
                  value={item.description} 
                  onChange={(e) => setPrices(prices.map(p => p.id === item.id ? { ...p, description: e.target.value } : p))}
                  className="bg-white/5 border-white/10 h-24 rounded-none text-white text-[13px] leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-white/90 py-6 rounded-none font-bold uppercase tracking-widest">
        <Save className="w-4 h-4 mr-2" /> Save Investment Data
      </Button>
    </div>
  );
}
