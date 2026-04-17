import { useState } from "react"; // 1. BIAR GAK MERAH: Harus di-import
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
   import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faCubes, faChartLine } from "@fortawesome/free-solid-svg-icons";

// Import Halaman
import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import Kategori from "./pages/Kategori";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
   // 2. BIAR GAK MERAH: State WAJIB di dalam fungsi App
   const [isOpen, setIsOpen] = useState(false);

   return (
      <Router>
         <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
            {/* --- NAVBAR MOBILE --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center z-50">
               <h1 className="text-xl font-black text-amber-500 italic">SM.v2</h1>
               <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white p-2">
                  <div className="space-y-1.5">
                     <span className={`block w-6 h-0.5 bg-current transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                     <span className={`block w-6 h-0.5 bg-current transition-all ${isOpen ? "opacity-0" : ""}`}></span>
                     <span className={`block w-6 h-0.5 bg-current transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                  </div>
               </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside
               className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 p-8 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 md:block
        `}>
               <div className="mb-12">
                  <h1 className="text-2xl font-black text-amber-500 italic tracking-tighter">
                     STOCKMASTER<span className="text-zinc-500 text-xs">.v2</span>
                  </h1>
               </div>

               <nav className="space-y-2">
                  <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${isActive ? "bg-green-500 text-zinc-950 shadow-lg shadow-green-500/20" : "text-zinc-500 hover:bg-zinc-800"}`}>
                     <FontAwesomeIcon icon={faChartLine} /> DASHBOARD
                  </NavLink>
                  <NavLink to="/barang" onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${isActive ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "text-zinc-500 hover:bg-zinc-800"}`}>
                     <FontAwesomeIcon icon={faCubes} /> DATA BARANG
                  </NavLink>
                  <NavLink to="/kategori" onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${isActive ? "bg-blue-500 text-zinc-950 shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:bg-zinc-800"}`}>
                     <FontAwesomeIcon icon={faCubes} /> DATA KATEGORI
                  </NavLink>
               </nav>
            </aside>

            {/* --- OVERLAY --- */}
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)}></div>}

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto mt-16 md:mt-0">
               <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/barang" element={<Barang />} />
                  <Route path="/kategori" element={<Kategori />} />
               </Routes>
            </main>
         </div>
      </Router>
   );
}
