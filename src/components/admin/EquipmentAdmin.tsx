import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EquipmentAdmin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [studioPhotos, setStudioPhotos] = useState<string[]>([
    "", "", "", ""
  ]);
  const [isUploading, setIsUploading] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "equipment"));
      const fetchedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (fetchedCategories.length === 0) {
        // Initial defaults if firestore is empty
        setCategories([
          { id: "monitors", name: "Monitors", items: ["Amphion Two 15", "ADAM S3V", "Shure 440", "Shure 840", "Slate digital VSX"] },
          { id: "microphones", name: "Microphones", items: ["Neumann U87ai", "UAD Shere DLX"] },
          { id: "interface", name: "Audio Interface", items: ["UAD Apollo 8 & 16"] },
          { id: "outboard", name: "Outboard", items: ["Neve Shelford Channel Strip", "Neve 8816 Summing Mixer", "Klard Teknik DN-780 Reverb", "Orban 418a Limiter", "AMEK 9098 Comp/Limiter", "ORAM Sonics Hi-Def 35 EQ"] }
        ]);
      } else {
        setCategories(fetchedCategories);
      }

      const studioSnap = await getDoc(doc(db, "settings", "studio"));
      if (studioSnap.exists()) {
        const data = studioSnap.data();
        if (data.photos) setStudioPhotos(data.photos);
      } else {
        // Initial defaults for photos
        setStudioPhotos([
          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1280&q=80",
          "https://images.unsplash.com/photo-1520529011850-be19655968ff?auto=format&fit=crop&w=1280&q=80",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1280&q=80",
          "https://images.unsplash.com/photo-1557124816-e9b7d5440de2?auto=format&fit=crop&w=1280&q=80"
        ]);
      }
    }
    fetchData();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) {
      toast.error("Image is too large. Please select a file smaller than 800KB.");
      return;
    }

    setIsUploading(index);
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhotos = [...studioPhotos];
      newPhotos[index] = reader.result as string;
      setStudioPhotos(newPhotos);
      setIsUploading(null);
      toast.success(`Photo ${index + 1} updated.`);
    };
    reader.readAsDataURL(file);
  };

  const addCategory = () => {
    setCategories([...categories, { id: `temp-${Date.now()}`, name: "", items: [""] }]);
  };

  const removeCategory = async (id: string) => {
    if (!id.startsWith("temp-")) {
      await deleteDoc(doc(db, "equipment", id));
    }
    setCategories(categories.filter(c => c.id !== id));
  };

  const addItem = (catId: string) => {
    setCategories(categories.map(c => 
      c.id === catId ? { ...c, items: [...c.items, ""] } : c
    ));
  };

  const removeItem = (catId: string, itemIndex: number) => {
    setCategories(categories.map(c => 
      c.id === catId ? { ...c, items: c.items.filter((_, i) => i !== itemIndex) } : c
    ));
  };

  const updateItem = (catId: string, itemIndex: number, value: string) => {
    setCategories(categories.map(c => 
      c.id === catId ? { ...c, items: c.items.map((it, i) => i === itemIndex ? value : it) } : c
    ));
  };

  const handleSave = async () => {
    try {
      // Save Gear
      for (const cat of categories) {
        const { id, ...rest } = cat;
        if (id.toString().startsWith("temp-")) {
          await addDoc(collection(db, "equipment"), rest);
        } else {
          await setDoc(doc(db, "equipment", id), rest);
        }
      }

      // Save Studio Photos
      await setDoc(doc(db, "settings", "studio"), { photos: studioPhotos });

      toast.success("장비 및 스튜디오 정보가 저장되었습니다.");
      
      // Refresh Gear
      const querySnapshot = await getDocs(collection(db, "equipment"));
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      console.error("Equipment save error:", e);
      toast.error(`장비 정보 저장에 실패했습니다: ${e.message || e.toString()}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Studio Photos Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Studio Photos (4 Gallery)</h2>
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Recommended: 4:5 Aspect Ratio / Max 800KB</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {studioPhotos.map((photo, idx) => (
            <div key={idx} className="space-y-4">
              <div className="aspect-[4/5] bg-white/5 border border-white/10 relative overflow-hidden flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-white/10 text-[10px] uppercase font-bold tracking-widest">Empty Slot {idx + 1}</div>
                )}
                {isUploading === idx && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white">Upload Photo {idx + 1}</Label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, idx)}
                  className="bg-white/5 border-white/10 rounded-none text-white text-[10px] file:bg-white/10 file:border-0 file:text-white file:uppercase file:text-[9px] file:tracking-widest file:px-3 file:mr-3 hover:file:bg-white/20 transition-all cursor-pointer"
                />
                {photo && (
                  <Button 
                    variant="link" 
                    onClick={() => {
                      const newPhotos = [...studioPhotos];
                      newPhotos[idx] = "";
                      setStudioPhotos(newPhotos);
                    }}
                    className="text-red-500/50 hover:text-red-500 text-[9px] uppercase tracking-widest p-0 h-4"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gear Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Gear Categories</h2>
          <Button onClick={addCategory} variant="outline" className="border-white/10 hover:bg-white hover:text-black rounded-none h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Card key={cat.id} className="bg-studio-black border-white/10 rounded-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Input 
                value={cat.name} 
                onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c))}
                placeholder="Category Name"
                className="bg-transparent border-none p-0 text-lg font-bold uppercase tracking-widest focus-visible:ring-0 rounded-none"
              />
              <Button variant="ghost" size="icon" onClick={() => removeCategory(cat.id)} className="text-white/20 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cat.items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input 
                    value={item} 
                    onChange={(e) => updateItem(cat.id, idx, e.target.value)}
                    className="bg-white/5 border-white/10 rounded-none"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeItem(cat.id, idx)} className="text-white/20 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => addItem(cat.id)}
                className="w-full border border-dashed border-white/10 text-white/40 hover:text-white rounded-none"
              >
                <Plus className="w-3 h-3 mr-2" /> Add Item
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      </section>

      <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-white/90 py-6 font-bold uppercase tracking-widest rounded-none">
        <Save className="w-4 h-4 mr-2" /> Save Gear Configuration
      </Button>
    </div>
  );
}
