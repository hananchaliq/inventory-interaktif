
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function NavbarMobile({ isOpen, setIsOpen }) {
   return (
      <nav className="fixed top-0 left-0 right-0 z-40 md:hidden bg-[#0d0d0f] border-b border-[#222226] px-4 h-14 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-[#f5a623]" style={{ animation: "borderPulse 2s infinite" }} />
            <span className="font-mono text-[13px] tracking-[0.16em] text-[#f0f0f0]">TINKINV</span>
         </div>
         <button onClick={() => setIsOpen(p => !p)} className="text-[#555] hover:text-[#f5a623] transition-colors p-1" aria-label="Toggle menu">
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-sm" />
         </button>
         <style>{`
            @keyframes borderPulse {
               0%,100%{opacity:0.6} 50%{opacity:1}
            }
         `}</style>
      </nav>
   );
}
