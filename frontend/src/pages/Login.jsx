import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
   const navigate = useNavigate();
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [showPass, setShowPass] = useState(false);
   const [focused, setFocused] = useState(null);
   const containerRef = useRef(null);
   const cardRef = useRef(null);
   const cursorRef = useRef(null);

   useEffect(() => {
      const container = containerRef.current;
      const card = cardRef.current;
      const cursor = cursorRef.current;
      if (!container || !card) return;

      let raf;

      const onMove = e => {
         const cx = e.clientX;
         const cy = e.clientY;

         if (cursor) {
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
         }

         const rect = card.getBoundingClientRect();
         const x = ((cx - rect.left) / rect.width - 0.5) * 2;
         const y = ((cy - rect.top) / rect.height - 0.5) * 2;

         cancelAnimationFrame(raf);
         raf = requestAnimationFrame(() => {
            card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
         });
      };

      const onLeave = () => {
         cancelAnimationFrame(raf);
         card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
      };

      container.addEventListener("mousemove", onMove);
      container.addEventListener("mouseleave", onLeave);
      return () => {
         container.removeEventListener("mousemove", onMove);
         container.removeEventListener("mouseleave", onLeave);
         cancelAnimationFrame(raf);
      };
   }, []);

   const handleLogin = async e => {
      e.preventDefault();
      try {
         setLoading(true);
         const res = await axios.post("http://localhost/inventory-interaktif/api/login.php", { username, password });
         if (res.data.success) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
         } else {
            alert(res.data.message);
         }
      } catch {
         alert("Server Error");
      }
      setLoading(false);
   };

   return (
      <div ref={containerRef} className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4 overflow-hidden relative" style={{ cursor: "none" }}>
         {/* CUSTOM CURSOR */}
         <div ref={cursorRef} className="pointer-events-none fixed top-0 left-0 z-50" style={{ transform: "translate(-100px,-100px)", willChange: "transform" }}>
            <div className="relative -translate-x-1/2 -translate-y-1/2">
               <div className="w-3 h-3 bg-[#f5a623]" style={{ transition: "none" }} />
               <div className="absolute inset-0 w-3 h-3 bg-[#f5a623]" style={{ transform: "scale(3)", opacity: 0.08 }} />
            </div>
         </div>

         {/* GRID BACKGROUND */}
         <div
            className="absolute inset-0 pointer-events-none"
            style={{
               backgroundImage: `
                  linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)
               `,
               backgroundSize: "40px 40px",
            }}
         />

         {/* CORNER ACCENTS */}
         <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#f5a623]/20" />
         <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#f5a623]/20" />
         <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#f5a623]/20" />
         <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#f5a623]/20" />

         {/* SCANLINE ticker */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-0 right-0 h-px bg-[#f5a623]/10" style={{ animation: "scanline 6s linear infinite" }} />
         </div>

         <style>{`
            @keyframes scanline {
               0% { top: -2px; }
               100% { top: 100%; }
            }
            @keyframes fadeSlideUp {
               from { opacity: 0; transform: translateY(16px); }
               to { opacity: 1; transform: translateY(0); }
            }
            @keyframes borderPulse {
               0%, 100% { opacity: 0.6; }
               50% { opacity: 1; }
            }
         `}</style>

         {/* CARD */}
         <div
            ref={cardRef}
            className="w-full max-w-sm relative z-10"
            style={{
               transition: "transform 0.08s ease-out",
               willChange: "transform",
               animation: "fadeSlideUp 0.5s ease-out both",
            }}>
            <div className="border border-[#222226] bg-[#111113] overflow-hidden">
               {/* HEADER */}
               <div className="border-b border-[#222226] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 bg-[#f5a623]" style={{ animation: "borderPulse 2s ease-in-out infinite" }} />
                     <span className="font-mono text-[13px] tracking-[0.18em] text-[#f0f0f0] font-medium">TINKINV</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#333] tracking-[0.1em] uppercase">v2.0 · IMS</span>
               </div>

               {/* SYSTEM LINE */}
               <div className="px-6 py-2 border-b border-[#1a1a1d] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#333] tracking-[0.08em]">AUTH NODE ACTIVE · SECURE CHANNEL</span>
               </div>

               <form onSubmit={handleLogin} className="p-6 space-y-5">
                  {[
                     { label: "Username", type: "text", val: username, set: setUsername, id: "usr" },
                     { label: "Password", type: showPass ? "text" : "password", val: password, set: setPassword, id: "pwd" },
                  ].map(field => (
                     <div key={field.id}>
                        <div className="flex justify-between mb-1.5">
                           <label className="text-[9px] uppercase tracking-[0.12em] text-[#444] font-mono">{field.label}</label>
                           {field.id === "pwd" && (
                              <button type="button" onClick={() => setShowPass(p => !p)} className="text-[9px] font-mono text-[#333] hover:text-[#f5a623] transition-colors tracking-wide uppercase">
                                 {showPass ? "Hide" : "Show"}
                              </button>
                           )}
                        </div>
                        <div className="relative">
                           <input
                              type={field.type}
                              value={field.val}
                              onChange={e => field.set(e.target.value)}
                              onFocus={() => setFocused(field.id)}
                              onBlur={() => setFocused(null)}
                              className="w-full bg-[#0c0c0e] border border-[#222226] px-3 py-3 text-[#f0f0f0] text-[12px] font-mono outline-none transition-all duration-150"
                              style={{
                                 borderColor: focused === field.id ? "#f5a623" : undefined,
                                 cursor: "none",
                              }}
                           />
                           {focused === field.id && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-[#f5a623]" style={{ animation: "borderPulse 1s ease-in-out infinite" }} />}
                        </div>
                     </div>
                  ))}

                  <button disabled={loading} type="submit" className="w-full py-3 bg-[#f5a623] text-[#111] text-[10px] font-bold tracking-[0.14em] font-mono uppercase transition-all duration-150 hover:bg-[#e09520] active:scale-[0.98] disabled:opacity-50 relative overflow-hidden" style={{ cursor: "none" }}>
                     <span className="relative z-10">{loading ? "AUTHENTICATING..." : "LOGIN"}</span>
                  </button>

                  <div className="text-center text-[9px] font-mono text-[#2a2a2e] tracking-widest">TINKINV LIFE · INVENTORY MANAGEMENT SYSTEM</div>
               </form>
            </div>

            {/* BOTTOM CORNER MARKS */}
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-[#f5a623]/30" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[#f5a623]/30" />
         </div>
      </div>
   );
}
