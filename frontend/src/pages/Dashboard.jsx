import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faLayerGroup, faChartLine, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Dashboard() {
   const [stats, setStats] = useState({ barang: 0, kategori: 0 });
   const [dataAnalitik, setDataAnalitik] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetch("http://localhost/inventory-interaktif/backend/get_analitik.php")
         .then(res => res.json())
         .then(data => {
            setDataAnalitik(data);
            setLoading(false);
         })
         .catch(err => console.error(err));
      // Ambil data buat ngitung total

      const fetchStats = async () => {
         try {
            const resBarang = await fetch("http://localhost/inventory-interaktif/backend/index.php");
            const resKat = await fetch("http://localhost/inventory-interaktif/backend/get_kategori.php");

            const dataBarang = await resBarang.json();
            const dataKat = await resKat.json();

            setStats({
               barang: dataBarang.length,
               kategori: dataKat.length,
            });
         } catch (err) {
            console.error("Gagal ambil stats:", err);
         }
      };
      fetchStats();
   }, []);

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
         {/* 1. WELCOME SECTION */}
         <div className="mb-10">
            <h2 className="text-4xl font-black italic tracking-tighter">
               OVERVIEW <span className="text-amber-500 text-2xl not-italic font-light ml-2">/ SYSTEM SUMMARY</span>
            </h2>
            <p className="text-zinc-500 mt-2 font-medium">Selamat bekerja, Admin! Berikut ringkasan inventaris lu hari ini.</p>
         </div>

         {/* 2. STATS GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Card Total Barang */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-amber-500/50 transition-all">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
               <FontAwesomeIcon icon={faCubes} className="text-amber-500 text-3xl mb-4" />
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Total Koleksi Barang</p>
               <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-5xl font-black text-zinc-100">{stats.barang}</p>
                  <span className="text-sm text-zinc-700 font-bold italic">ITEMS</span>
               </div>
               <Link to="/barang" className="mt-6 flex items-center gap-2 text-[10px] font-black text-zinc-600 hover:text-amber-500 transition-colors">
                  LIHAT DETAIL <FontAwesomeIcon icon={faArrowRight} />
               </Link>
            </div>

            {/* Card Total Kategori */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/50 transition-all">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
               <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500 text-3xl mb-4" />
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Kategori Terdaftar</p>
               <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-5xl font-black text-zinc-100">{stats.kategori}</p>
                  <span className="text-sm text-zinc-700 font-bold italic">SECTIONS</span>
               </div>
               <Link to="/kategori" className="mt-6 flex items-center gap-2 text-[10px] font-black text-zinc-600 hover:text-blue-500 transition-colors">
                  LIHAT DETAIL <FontAwesomeIcon icon={faArrowRight} />
               </Link>
            </div>

            {/* Card System Status */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center border-dashed">
               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping mb-4"></div>
               <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Server Status</p>
               <p className="text-xl font-black text-zinc-100 mt-1">CONNECTED</p>
               <p className="text-zinc-700 text-[9px] mt-2 font-mono">Localhost: PHP Native API</p>
            </div>
         </div>

         {/* 3. RECENT INFO / PLACEHOLDER */}
         <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-amber-500/10 rounded-xl">
                  <FontAwesomeIcon icon={faChartLine} className="text-amber-500 text-xl" />
               </div>
               <div>
                  <h3 className="text-white font-black italic uppercase tracking-tighter">Sebaran Produk</h3>
                  <p className="text-zinc-500 text-xs">Jumlah produk berdasarkan kategori aktif</p>
               </div>
            </div>

            <div className="h-[300px] w-full">
               {loading ? (
                  <div className="h-full flex items-center justify-center text-zinc-600 italic">Memuat data analitik...</div>
               ) : (
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={dataAnalitik}>
                        <defs>
                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "#27272a", borderRadius: "12px", fontSize: "12px" }} itemStyle={{ color: "#f59e0b", fontWeight: "bold" }} />
                        <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                     </AreaChart>
                  </ResponsiveContainer>
               )}
            </div>
         </div>
      </div>
   );
}
