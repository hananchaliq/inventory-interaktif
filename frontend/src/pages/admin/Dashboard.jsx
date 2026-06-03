import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faLayerGroup, faArrowRight, faClock, faMicrochip, faHeartPulse, faFilter, faServer, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// Import hook mouse parallax
import useMouseParallax from "../../hooks/useMouseParallax";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Dashboard() {
   const [stats, setStats] = useState({ barang: 0, kategori: 0, totalAktivitas: 0 });
   const [dataAnalitik, setDataAnalitik] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filterWaktu, setFilterWaktu] = useState("3bulan");
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
   const [sysTime, setSysTime] = useState(new Date().toLocaleTimeString());
   const [operator, setOperator] = useState({ nama: "Loading...", role: "Securing..." });

   // Inisialisasi hook parallax untuk masing-masing card/node
   const barangParallaxRef = useMouseParallax();
   const kategoriParallaxRef = useMouseParallax();
   const mutasiParallaxRef = useMouseParallax();
   const infoNodeParallaxRef = useMouseParallax();

   useEffect(() => {
      const timer = setInterval(() => setSysTime(new Date().toLocaleTimeString()), 1000);
      return () => clearInterval(timer);
   }, []);

   useEffect(() => {
      if (filterWaktu === "custom" && (!startDate || !endDate)) return;
      setLoading(true);
      let targetUrl = `${apiUrl}get_analitik.php?range=${filterWaktu}`;
      if (filterWaktu === "custom") targetUrl += `&start=${startDate}&end=${endDate}`;

      fetch(targetUrl)
         .then(res => res.json())
         .then(data => {
            if (Array.isArray(data)) {
               setDataAnalitik(
                  data.map(item => ({
                     tanggal: item.tanggal || item.name || "Unknown",
                     masuk: item.masuk !== undefined ? parseInt(item.masuk) : parseInt(item.value) || 0,
                     keluar: item.keluar !== undefined ? parseInt(item.keluar) : 0,
                  }))
               );
            } else {
               setDataAnalitik([]);
            }
            setLoading(false);
         })
         .catch(() => {
            setDataAnalitik([]);
            setLoading(false);
         });
   }, [filterWaktu, startDate, endDate]);

   useEffect(() => {
      const ambilStatistik = async () => {
         try {
            const [resBarang, resKat, resRiwayat, resOperator] = await Promise.all([
               fetch(`${apiUrl}index.php`),
               fetch(`${apiUrl}get_kategori.php`),
               fetch(`${apiUrl}get_riwayat.php`),
               fetch(`${apiUrl}get_operator.php`), // Endpoint API info admin/operator kamu
            ]);

            const [dataBarang, dataKat, dataRiwayat, dataOperator] = await Promise.all([resBarang.json(), resKat.json(), resRiwayat.json(), resOperator.json()]);

            // Set data statistik utama
            setStats({
               barang: Array.isArray(dataBarang) ? dataBarang.length : 0,
               kategori: Array.isArray(dataKat) ? dataKat.length : 0,
               totalAktivitas: Array.isArray(dataRiwayat) ? dataRiwayat.length : 0,
            });

            // Set data operator dinamis dari database
            // Menyesuaikan jika response berbentuk object atau array bawaan dari query database
            if (dataOperator) {
               setOperator({
                  username: dataOperator.username || "-",
                  nama: dataOperator.nama || "-",
                  role: dataOperator.role || "Admin",
                  // Mengambil 2 huruf inisial dari nama secara dinamis untuk avatar
                  inisial: (dataOperator.nama || dataOperator.username || "AD").substring(0, 2).toUpperCase(),
               });
            }
         } catch (err) {
            console.error("Gagal sinkronisasi data node:", err);
            setOperator({ nama: "Offline Node", role: "Auth Error" });
         }
      };
      ambilStatistik();
   }, []);

   return (
      <div className="space-y-6">
         {/* HEADER */}
         <div className="border-b border-[#222226] pb-5">
            <h2 className="text-xl font-medium tracking-tight text-[#f0f0f0] font-mono">Overview Core</h2>
            <p className="text-[11px] text-[#444] mt-0.5 font-mono tracking-wide">Ringkasan matriks analitik dan kesehatan ekosistem logistik Tinkinv Life.</p>
         </div>

         {/* 3 STAT CARDS */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Card Barang */}
            <div
               ref={barangParallaxRef}
               className="bg-[#161618] border border-[#222226] p-5 scroll-reveal flex flex-col justify-between group hover:border-[#f5a623]/40 transition-all duration-200 overflow-hidden relative"
               style={{
                  transform: "perspective(1000px) rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 5deg))",
                  transition: "transform 0.15s ease-out, border-color 0.2s",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
               }}>
               <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
                  <div>
                     <p className="text-[9px] font-mono text-[#444] uppercase tracking-[0.12em]">Total SKU Terdaftar</p>
                     <h4 className="text-2xl font-medium text-[#f0f0f0] mt-1.5 font-mono">{stats.barang}</h4>
                  </div>
                  <div className="p-2 bg-[#1e1e21] border border-[#2a2a2e] text-[#555] group-hover:text-[#f5a623] group-hover:border-[#f5a623]/30 transition-colors">
                     <FontAwesomeIcon icon={faCubes} className="text-sm" />
                  </div>
               </div>
               <Link to="/barang" className="text-[10px] font-mono text-[#444] hover:text-[#f5a623] mt-4 inline-flex items-center gap-1.5 transition-colors" style={{ transform: "translateZ(10px)" }}>
                  Buka Manajer Barang
                  <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
               </Link>
            </div>

            {/* Card Kategori */}
            <div
               ref={kategoriParallaxRef}
               className="bg-[#161618] border border-[#222226] p-5 scroll-reveal flex flex-col justify-between group hover:border-[#378add]/30 transition-all duration-200 overflow-hidden relative"
               style={{
                  transform: "perspective(1000px) rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 5deg))",
                  transition: "transform 0.15s ease-out, border-color 0.2s",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
               }}>
               <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
                  <div>
                     <p className="text-[9px] font-mono text-[#444] uppercase tracking-[0.12em]">Klaster Kategori</p>
                     <h4 className="text-2xl font-medium text-[#f0f0f0] mt-1.5 font-mono">{stats.kategori}</h4>
                  </div>
                  <div className="p-2 bg-[#1e1e21] border border-[#2a2a2e] text-[#555] group-hover:text-[#378add] group-hover:border-[#378add]/30 transition-colors">
                     <FontAwesomeIcon icon={faLayerGroup} className="text-sm" />
                  </div>
               </div>
               <Link to="/kategori" className="text-[10px] font-mono text-[#444] hover:text-[#378add] mt-4 inline-flex items-center gap-1.5 transition-colors" style={{ transform: "translateZ(10px)" }}>
                  Buka Manajer Kategori
                  <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
               </Link>
            </div>

            {/* Card Mutasi */}
            <div
               ref={mutasiParallaxRef}
               className="bg-[#161618] border border-[#222226] p-5 scroll-reveal flex flex-col justify-between group hover:border-[#22c55e]/30 transition-all duration-200 sm:col-span-2 lg:col-span-1 overflow-hidden relative"
               style={{
                  transform: "perspective(1000px) rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 5deg))",
                  transition: "transform 0.15s ease-out, border-color 0.2s",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
               }}>
               <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
                  <div>
                     <p className="text-[9px] font-mono text-[#444] uppercase tracking-[0.12em]">Total Trafik Mutasi</p>
                     <h4 className="text-2xl font-medium text-[#f0f0f0] mt-1.5 font-mono">
                        {stats.totalAktivitas} <span className="text-xs font-normal text-[#444]">Logs</span>
                     </h4>
                  </div>
                  <div className="p-2 bg-[#1e1e21] border border-[#2a2a2e] text-[#555] group-hover:text-[#22c55e] group-hover:border-[#22c55e]/30 transition-colors">
                     <FontAwesomeIcon icon={faServer} className="text-sm" />
                  </div>
               </div>
               <div className="text-[10px] font-mono text-[#444] mt-4 flex items-center gap-2" style={{ transform: "translateZ(10px)" }}>
                  <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                  Sistem Sinkron & Aktif
               </div>
            </div>
         </div>

         {/* GRAFIK + INFO NODE */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Grafik */}
            <div className="lg:col-span-2 bg-[#161618] border border-[#222226] p-5 flex flex-col gap-5 scroll-reveal">
               <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#222226] pb-4">
                  <div>
                     <h3 className="text-[12px] font-medium text-[#ccc] font-mono tracking-wide">Kurva Fluktuasi Kuantitas Logistik</h3>
                     <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#22c55e] uppercase tracking-widest">
                           <span className="w-1.5 h-1.5 bg-[#22c55e]" /> Masuk
                        </span>
                        <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#e24b4a] uppercase tracking-widest">
                           <span className="w-1.5 h-1.5 bg-[#e24b4a]" /> Keluar
                        </span>
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                     <div className="flex items-center bg-[#111113] border border-[#222226] p-1 gap-px">
                        {[
                           { id: "hari", label: "Hari Ini" },
                           { id: "7hari", label: "7D" },
                           { id: "30hari", label: "30D" },
                           { id: "3bulan", label: "3M" },
                        ].map(tgl => (
                           <button key={tgl.id} onClick={() => setFilterWaktu(tgl.id)} className={`px-2.5 py-1 transition-all duration-150 ${filterWaktu === tgl.id ? "bg-[#f5a623] text-[#111]" : "text-[#555] hover:text-[#ccc]"}`}>
                              {tgl.label}
                           </button>
                        ))}
                     </div>
                     <button onClick={() => setFilterWaktu("custom")} className={`px-2.5 py-1.5 border flex items-center gap-1.5 transition-all ${filterWaktu === "custom" ? "border-[#f5a623] text-[#f5a623] bg-[#f5a623]/5" : "border-[#222226] text-[#555] hover:text-[#ccc]"}`}>
                        <FontAwesomeIcon icon={faFilter} className="text-[9px]" />
                        Custom
                     </button>
                     {filterWaktu === "custom" && (
                        <div className="flex items-center gap-1.5 bg-[#111113] border border-[#f5a623]/20 px-2 py-1">
                           <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-[#ccc] border-none outline-none font-mono text-[10px]" />
                           <span className="text-[#444]">—</span>
                           <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-[#ccc] border-none outline-none font-mono text-[10px]" />
                        </div>
                     )}
                  </div>
               </div>

               <div className="h-[260px] w-full">
                  {loading ? (
                     <div className="h-full flex items-center justify-center text-[#444] text-[11px] font-mono">{filterWaktu === "custom" && (!startDate || !endDate) ? "Tentukan parameter tanggal..." : "Memuat kurva..."}</div>
                  ) : dataAnalitik.length === 0 ? (
                     <div className="h-full flex items-center justify-center text-[#444] text-[11px] font-mono">Tidak ada rekaman pada rentang ini.</div>
                  ) : (
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataAnalitik} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#e24b4a" stopOpacity={0.12} />
                                 <stop offset="95%" stopColor="#e24b4a" stopOpacity={0} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid stroke="#1e1e21" vertical={false} />
                           <XAxis dataKey="tanggal" stroke="#333" fontSize={10} tickLine={false} fontFamily="monospace" />
                           <YAxis stroke="#333" fontSize={10} tickLine={false} axisLine={false} fontFamily="monospace" />
                           <Tooltip contentStyle={{ backgroundColor: "#161618", border: "1px solid #222226", borderRadius: "0", fontSize: "11px", color: "#ccc", fontFamily: "monospace" }} />
                           <Area type="monotone" dataKey="masuk" stroke="#22c55e" strokeWidth={1.5} fill="url(#colorMasuk)" />
                           <Area type="monotone" dataKey="keluar" stroke="#e24b4a" strokeWidth={1.5} fill="url(#colorKeluar)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  )}
               </div>
            </div>

            {/* Info Node dengan Parallax */}
            <div
               ref={infoNodeParallaxRef}
               className="bg-[#161618] border border-[#222226] p-5 flex flex-col justify-between scroll-reveal overflow-hidden relative"
               style={{
                  transform: "perspective(1000px) rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 5deg))",
                  transition: "transform 0.15s ease-out",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
               }}>
               {/* STATUS BAR DINAMIS */}
               <div className="absolute top-0 right-0 flex items-center gap-2 px-4 py-3">
                  <span className="relative flex h-[5px] w-[5px]">
                     <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loading ? "bg-amber-400" : "bg-green-400"}`} />
                     <span className={`relative inline-flex rounded-full h-[5px] w-[5px] ${loading ? "bg-amber-500" : "bg-green-500"}`} />
                  </span>
                  <span className="text-[9px] text-[#444] uppercase tracking-[0.1em] font-mono">{loading ? "Syncing..." : "System Active"}</span>
               </div>

               <div style={{ transform: "translateZ(20px)" }}>
                  <h3 className="text-[11px] font-mono text-[#ccc] flex items-center gap-2 tracking-wide">
                     <FontAwesomeIcon icon={faUserShield} className="text-[#f5a623] text-[10px]" />
                     Node Operator
                  </h3>
                  <p className="text-[#444] text-[10px] font-mono mt-0.5">Identitas otentikasi admin aktif.</p>

                  {/* AVATAR & INFO OPERATOR DARI DB */}
                  <div className="mt-4 p-3 bg-[#111113] border border-[#222226] flex items-center gap-3">
                     <div className="w-9 h-9 bg-[#f5a623] flex items-center justify-center font-bold text-[#111] text-sm font-mono select-none">{operator.inisial || "AD"}</div>
                     <div className="min-w-0">
                        <p className="text-[11px] font-medium text-[#f0f0f0] font-mono truncate">{operator.username} || {operator.nama}</p>
                        <p className="text-[#444] text-[10px] font-mono mt-0.5 truncate">Role: {operator.role}</p>
                     </div>
                  </div>
               </div>

               <div className="border-t border-[#222226] pt-4 mt-4 space-y-3" style={{ transform: "translateZ(15px)" }}>
                  <p className="text-[9px] font-mono text-[#333] uppercase tracking-[0.12em]">Core Health State</p>
                  {[
                     { icon: faClock, label: "Internal Clock", val: sysTime, cls: "text-[#f0f0f0]" },
                     { icon: faMicrochip, label: "Environment Load", val: loading ? "Computing..." : "Stable (0.42s)", cls: "text-[#f0f0f0]" },
                     { icon: faHeartPulse, label: "Core Engine", val: loading ? "SYNCING" : "ACTIVE", cls: loading ? "text-[#f5a623]" : "text-[#22c55e]" },
                  ].map(row => (
                     <div key={row.label} className="flex justify-between items-center text-[10px] font-mono">
                        <span className="flex items-center gap-1.5 text-[#444]">
                           <FontAwesomeIcon icon={row.icon} className="text-[9px]" />
                           {row.label}
                        </span>
                        <span className={`${row.cls} font-medium`}>{row.val}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
