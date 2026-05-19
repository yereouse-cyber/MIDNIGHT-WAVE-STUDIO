import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-20 bg-studio-black">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 flex flex-col md:flex-row justify-between items-end gap-12">
        <div>
          <span className="font-display font-bold tracking-tighter text-3xl uppercase block mb-4">MIDNIGHT WAVE.</span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">© MMXXIV MIDNIGHT WAVE STUDIO. ALL RIGHTS RESERVED.</p>
        </div>
        
        <div className="flex flex-col items-end gap-6">
          <Link 
            to="/admin" 
            className="text-[9px] uppercase tracking-[0.3em] text-white/30 border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
          >
            Terminal Access
          </Link>
          <div className="text-[9px] uppercase tracking-[0.3em] text-white/10">
            Seoul, South Korea
          </div>
        </div>
      </div>
    </footer>
  );
}
