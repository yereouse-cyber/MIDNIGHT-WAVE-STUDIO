import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Music2, LogOut, Save, Plus, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";

import EquipmentAdmin from "@/components/admin/EquipmentAdmin";
import PricingAdmin from "@/components/admin/PricingAdmin";
import FAQAdmin from "@/components/admin/FAQAdmin";
import WorkflowAdmin from "@/components/admin/WorkflowAdmin";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "7791") {
      setIsAdmin(true);
      toast.success("관리자 인증 성공");
    } else {
      toast.error("비밀번호가 틀렸습니다.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-studio-black">
        <Card className="w-full max-w-md bg-studio-black border-white/10 rounded-none">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-white mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold tracking-tighter uppercase">Terminal Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white">Access Key</Label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-none h-12 text-center text-lg tracking-[0.5em] text-white"
                  placeholder="****"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-bold uppercase tracking-widest"
              >
                Authorize
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Studio Manager.</h1>
          <p className="text-white text-[10px] uppercase tracking-widest font-medium">Session Active / Admin Access</p>
        </div>
        <Button variant="outline" onClick={() => setIsAdmin(false)} className="border-white/10 hover:bg-white hover:text-black rounded-none uppercase text-[10px] tracking-widest px-6">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <Tabs defaultValue="home" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 flex overflow-x-auto h-auto rounded-none">
          <TabsTrigger value="home" className="flex-1 min-w-[100px] rounded-none py-3 text-[11px] uppercase tracking-widest text-white data-[state=active]:bg-white/10">General</TabsTrigger>
          <TabsTrigger value="portfolio" className="flex-1 min-w-[100px] rounded-none py-3 text-[11px] uppercase tracking-widest text-white data-[state=active]:bg-white/10">Discography</TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1 min-w-[100px] rounded-none py-3 text-[11px] uppercase tracking-widest text-white data-[state=active]:bg-white/10">Studio / Gear</TabsTrigger>
          <TabsTrigger value="pricing" className="flex-1 min-w-[100px] rounded-none py-3 text-[11px] uppercase tracking-widest text-white data-[state=active]:bg-white/10">Pricing</TabsTrigger>
          <TabsTrigger value="faq" className="flex-1 min-w-[100px] rounded-none py-3 text-[11px] uppercase tracking-widest text-white data-[state=active]:bg-white/10">FAQ</TabsTrigger>
          <TabsTrigger value="workflow" className="flex-1 min-w-[100px] rounded-none py-3 text-[11px] uppercase tracking-widest text-white data-[state=active]:bg-white/10">Process</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <HomeAdmin />
        </TabsContent>
        <TabsContent value="portfolio">
          <PortfolioAdmin />
        </TabsContent>
        <TabsContent value="equipment">
          <EquipmentAdmin />
        </TabsContent>
        <TabsContent value="pricing">
          <PricingAdmin />
        </TabsContent>
        <TabsContent value="faq">
          <FAQAdmin />
        </TabsContent>
        <TabsContent value="workflow">
          <WorkflowAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HomeAdmin() {
  const [data, setData] = useState({
    introText: "",
    address: "",
    instagramUrl: "",
    email: "",
    heroImageDesktop: "",
    heroImageMobile: "",
  });
  const [isUploading, setIsUploading] = useState<{type: 'desktop' | 'mobile', value: boolean}>({ type: 'desktop', value: false });

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "settings", "home");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();
        setData({
          introText: fetchedData.introText || "",
          address: fetchedData.address || "",
          instagramUrl: fetchedData.instagramUrl || "",
          email: fetchedData.email || "",
          heroImageDesktop: fetchedData.heroImageDesktop || fetchedData.heroImage || "",
          heroImageMobile: fetchedData.heroImageMobile || "",
        });
      }
    }
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) {
      toast.error("Image is too large. Please select a file smaller than 800KB.");
      return;
    }

    setIsUploading({ type, value: true });
    const reader = new FileReader();
    reader.onloadend = () => {
      setData(prev => ({ 
        ...prev, 
        [type === 'desktop' ? 'heroImageDesktop' : 'heroImageMobile']: reader.result as string 
      }));
      setIsUploading({ type, value: false });
      toast.success(`${type.toUpperCase()} image selected. Don't forget to save changes.`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "settings", "home"), data);
      toast.success("홈 정보가 저장되었습니다.");
    } catch (e: any) {
      console.error("Home save error:", e);
      toast.error(`홈 정보 저장에 실패했습니다: ${e.message || e.toString()}`);
    }
  };

  return (
    <Card className="bg-studio-black border-white/10 rounded-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold uppercase tracking-tight text-white">General Studio Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
          {/* Desktop Image */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] uppercase tracking-widest text-white">Desktop Background Image (PC)</Label>
              <span className="text-[9px] text-white/30 uppercase tracking-tighter">Recommended: 1920x1080</span>
            </div>
            <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              {data.heroImageDesktop ? (
                <img src={data.heroImageDesktop} alt="Desktop Hero" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/20 text-[10px] uppercase tracking-widest text-center px-4">No Desktop Image Selected</span>
              )}
              {isUploading.type === 'desktop' && isUploading.value && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'desktop')}
                className="bg-white/5 border-white/10 rounded-none text-white file:bg-white/10 file:border-0 file:text-white file:text-[10px] file:uppercase file:tracking-widest file:px-4 file:mr-4 hover:file:bg-white/20 transition-all cursor-pointer"
              />
              {data.heroImageDesktop && (
                <Button 
                  variant="destructive" 
                  onClick={() => setData(prev => ({ ...prev, heroImageDesktop: "" }))}
                  className="rounded-none uppercase text-[10px] tracking-widest h-8 w-full"
                >
                  <Trash2 className="w-3 h-3 mr-2" /> Remove Desktop Image
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Image */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] uppercase tracking-widest text-white">Mobile Background Image (Cell Phone)</Label>
              <span className="text-[9px] text-white/30 uppercase tracking-tighter">Recommended: 1080x1920</span>
            </div>
            <div className="aspect-[9/16] max-w-[200px] mx-auto bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              {data.heroImageMobile ? (
                <img src={data.heroImageMobile} alt="Mobile Hero" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/20 text-[10px] uppercase tracking-widest text-center px-4">No Mobile Image Selected</span>
              )}
              {isUploading.type === 'mobile' && isUploading.value && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'mobile')}
                className="bg-white/5 border-white/10 rounded-none text-white file:bg-white/10 file:border-0 file:text-white file:text-[10px] file:uppercase file:tracking-widest file:px-4 file:mr-4 hover:file:bg-white/20 transition-all cursor-pointer"
              />
              {data.heroImageMobile && (
                <Button 
                  variant="destructive" 
                  onClick={() => setData(prev => ({ ...prev, heroImageMobile: "" }))}
                  className="rounded-none uppercase text-[10px] tracking-widest h-8 w-full"
                >
                  <Trash2 className="w-3 h-3 mr-2" /> Remove Mobile Image
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-white">Studio Introduction</Label>
          <Textarea 
            value={data.introText} 
            onChange={(e) => setData({ ...data, introText: e.target.value })}
            className="bg-white/5 border-white/10 h-32 rounded-none text-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-white">Studio Address</Label>
            <Input 
              value={data.address} 
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="bg-white/5 border-white/10 rounded-none text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-white">Email Address</Label>
            <Input 
              value={data.email} 
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="bg-white/5 border-white/10 rounded-none text-white"
              placeholder="arion@recording.studio"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-white">Instagram URL</Label>
          <Input 
            value={data.instagramUrl} 
            onChange={(e) => setData({ ...data, instagramUrl: e.target.value })}
            className="bg-white/5 border-white/10 rounded-none text-white"
          />
        </div>
        <Button onClick={handleSave} className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-bold uppercase tracking-widest px-8">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}

function PortfolioAdmin() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (fetchedItems.length === 0) {
        setItems([
          { id: "temp-1", artistName: "NewJeans", songTitle: "OMG", youtubeId: "_ZAgIHmHLdc", genre: "Mixing & Mastering", category: "K-POP" },
          { id: "temp-2", artistName: "IVE", songTitle: "I AM", youtubeId: "6ZUIwj3FgUY", genre: "Mixing & Mastering", category: "K-POP" },
          { id: "temp-3", artistName: "Le Sserafim", songTitle: "UNFORGIVEN", youtubeId: "UBURTjKbh0E", genre: "Mixing & Mastering", category: "K-POP" },
          { id: "temp-4", artistName: "Aespa", songTitle: "Spicy", youtubeId: "Os_heh8vPfs", genre: "Mixing & Mastering", category: "K-POP" },
          { id: "temp-5", artistName: "(G)I-DLE", songTitle: "Queencard", youtubeId: "7HDeem-JaSY", genre: "Mixing & Mastering", category: "K-POP" },
          { id: "temp-6", artistName: "Blackpink", songTitle: "Shut Down", youtubeId: "POe9iMUEH_4", genre: "Mixing & Mastering", category: "K-POP" },
          { id: "temp-7", artistName: "BTS", songTitle: "Dynamite", youtubeId: "gdZLi9oWNZg", genre: "Mixing & Mastering", category: "K-POP" },
          { id: "temp-8", artistName: "IU", songTitle: "LILAC", youtubeId: "v7bnOxL4LIo", genre: "Mixing & Mastering", category: "K-POP" }
        ]);
      } else {
        setItems(fetchedItems);
      }
    }
    fetchData();
  }, []);

  const addItem = () => {
    const newItem = { id: `temp-${Date.now()}`, artistName: "", songTitle: "", youtubeId: "", genre: "", category: "K-POP" };
    setItems([...items, newItem]);
  };

  const removeItem = async (id: string) => {
    if (!id.startsWith("temp-")) {
      await deleteDoc(doc(db, "portfolio", id));
    }
    setItems(items.filter(item => item.id !== id));
  };

  const extractYoutubeId = (input: string) => {
    if (!input) return "";
    // Check if it's an iframe (source code)
    if (input.includes("<iframe")) {
      const match = input.match(/embed\/([^"?\s]+)/);
      if (match && match[1]) return match[1];
    }
    // Check if it's a full URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : input;
  };

  const handleSave = async () => {
    try {
      for (const item of items) {
        const { id, ...rest } = item;
        if (id.toString().startsWith("temp-")) {
          await addDoc(collection(db, "portfolio"), rest);
        } else {
          await setDoc(doc(db, "portfolio", id), rest);
        }
      }
      toast.success("포트폴리오가 저장되었습니다.");
      // Refresh
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      console.error("Portfolio save error:", e);
      toast.error(`포트폴리오 저장에 실패했습니다: ${e.message || e.toString()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white">Discography Management</h2>
        <Button onClick={addItem} variant="outline" className="border-white/10 hover:bg-white hover:text-black rounded-none h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
          <Plus className="w-4 h-4 mr-2" /> Add Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="bg-studio-black border-white/10 rounded-none">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-white">Artist Name</Label>
                  <Input 
                    value={item.artistName} 
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems.find(i => i.id === item.id)!.artistName = e.target.value;
                      setItems(newItems);
                    }}
                    className="bg-white/5 border-white/10 rounded-none text-white text-[13px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-white">Song Title</Label>
                  <Input 
                    value={item.songTitle} 
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems.find(i => i.id === item.id)!.songTitle = e.target.value;
                      setItems(newItems);
                    }}
                    className="bg-white/5 border-white/10 rounded-none text-white text-[13px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white">TAGS</Label>
                <Input 
                  value={item.genre} 
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems.find(i => i.id === item.id)!.genre = e.target.value;
                    setItems(newItems);
                  }}
                  placeholder="ex: K-POP, HIP-HOP, 믹싱"
                  className="bg-white/5 border-white/10 rounded-none text-white text-[13px]"
                />
              </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-white">YouTube Source Code / Link / ID</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={item.youtubeId} 
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems.find(i => i.id === item.id)!.youtubeId = extractYoutubeId(e.target.value);
                        setItems(newItems);
                      }}
                      placeholder="Paste embed code or URL here"
                      className="bg-white/5 border-white/10 rounded-none text-white text-[13px]"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 rounded-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[9px] text-white/30 uppercase tracking-tighter">Recommended: 16:9 Aspect Ratio. Paste the YouTube iframe code directly.</p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {items.length > 0 && (
        <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-white/90 py-6 rounded-none font-bold uppercase tracking-widest">
          <Save className="w-4 h-4 mr-2" /> Save Discography
        </Button>
      )}
    </div>
  );
}
