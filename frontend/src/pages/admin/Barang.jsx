import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faSearch, faTimes, faBoxes, faHistory, faClock, faArrowTrendUp, faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Listbox } from "@headlessui/react";
// Import hook mouse parallax sesuai standar project kita
import useMouseParallax from "../../hooks/useMouseParallax";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Barang() {
   const [dataBarang, setDataBarang] = useState([]);
   const [listKategori, setListKategori] = useState([]);
   const [riwayatLogs, setRiwayatLogs] = useState([]);
   const [nama, setNama] = useState("");
   const [stok, setStok] = useState("");
   const [kategori, setKategori] = useState("");
   const [catatan, setCatatan] = useState("");
   const [tipeTransaksi, setTipeTransaksi] = useState("masuk");
   const [cari, setCari] = useState("");
   const [filterRiwayat, setFilterRiwayat] = useState("semua");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editId, setEditId] = useState(null);
   const [stokAwalSaatEdit, setStokAwalSaatEdit] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   const [animasiStok, setAnimasiStok] = useState({ id: null, teks: "", tipe: "" });

   // Inisialisasi hook parallax menggunakan REF LANGSUNG seperti di Dashboard
   const totalProdukParallaxRef = useMouseParallax();
   const volumeMasukParallaxRef = useMouseParallax();
   const volumeKeluarParallaxRef = useMouseParallax();

   const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      background: "#161618",
      color: "#f0f0f0",
   });

   const ambilDataMurni = async () => {
      try {
         const res = await fetch(`${apiUrl}index.php`);
         if (!res.ok) throw new Error("Gagal mengambil data");
         setDataBarang(await res.json());
      } catch (err) {
         console.error(err);
      }
   };

   const ambilRiwayat = async () => {
      try {
         const res = await fetch(`${apiUrl}get_riwayat.php`);
         if (!res.ok) throw new Error("Gagal mengambil riwayat");
         setRiwayatLogs(await res.json());
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => {
      ambilDataMurni();
      ambilRiwayat();
      fetch(`${apiUrl}get_kategori.php`)
         .then(r => r.json())
         .then(d => setListKategori(d))
         .catch(console.error);
   }, []);

   const dapatkanStokAkhir = () => {
      const nominal = parseInt(stok, 10) || 0;
      if (!editId) return nominal;
      if (tipeTransaksi === "masuk") return stokAwalSaatEdit + nominal;
      if (tipeTransaksi === "keluar") return stokAwalSaatEdit - nominal;
      return nominal;
   };

   const simpanBarang = async e => {
      e.preventDefault();
      const nominalInput = parseInt(stok, 10);

      if (isNaN(nominalInput) || nominalInput < 0) {
         return Toast.fire({ icon: "warning", title: "Kuantitas tidak valid" });
      }

      const stokFinal = dapatkanStokAkhir();
      if (editId && tipeTransaksi === "keluar" && stokFinal < 0) {
         return Toast.fire({ icon: "error", title: `Stok minus! Batas: ${stokAwalSaatEdit}` });
      }

      setIsLoading(true);
      try {
         const url = editId ? "edit_barang.php" : "tambah_barang.php";
         const barangLama = dataBarang.find(b => b.id === editId);
         const kategoriIdFinal = editId && tipeTransaksi !== "edit_data" ? barangLama?.kategori_id || kategori : kategori;

         const resBarang = await fetch(`${apiUrl}${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               id: editId || null,
               nama_barang: editId && tipeTransaksi !== "edit_data" ? barangLama?.nama_barang || nama : nama,
               stok: tipeTransaksi === "edit_data" ? nominalInput : stokFinal,
               kategori_id: kategoriIdFinal,
            }),
         });

         const hasilBarang = await resBarang.json();

         if (hasilBarang.status === "success") {
            const targetId = editId || hasilBarang.id || Date.now();

            if (!editId || tipeTransaksi !== "edit_data") {
               await fetch(`${apiUrl}tambah_riwayat.php`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                     barang_id: targetId,
                     nama_barang: editId ? barangLama?.nama_barang || nama : nama,
                     tipe_transaksi: editId ? tipeTransaksi : "masuk",
                     jumlah: nominalInput,
                     catatan: catatan || (editId ? `Mutasi via panel kontrol` : `Registrasi awal SKU`),
                  }),
               });

               setAnimasiStok({
                  id: targetId,
                  teks: tipeTransaksi === "keluar" ? `-${nominalInput}` : `+${nominalInput}`,
                  tipe: tipeTransaksi === "keluar" ? "keluar" : "masuk",
               });
               setTimeout(() => setAnimasiStok({ id: null, teks: "", tipe: "" }), 2500);
            }

            Toast.fire({ icon: "success", title: "Sinkronisasi Berhasil!" });
            setIsModalOpen(false);
            bersihkanForm();
            ambilDataMurni();
            ambilRiwayat();
         }
      } catch (err) {
         console.error(err);
         Toast.fire({ icon: "error", title: "Koneksi API bermasalah" });
      } finally {
         setIsLoading(false);
      }
   };

   const bersihkanForm = () => {
      setEditId(null);
      setNama("");
      setStok("");
      setKategori("");
      setCatatan("");
      setStokAwalSaatEdit(0);
      setTipeTransaksi("masuk");
   };

   const totalSKU = dataBarang.length;
   const totalMasuk3Bulan = riwayatLogs.filter(l => l.tipe_transaksi === "masuk").reduce((s, l) => s + parseInt(l.jumlah || 0, 10), 0);
   const totalKeluar3Bulan = riwayatLogs.filter(l => l.tipe_transaksi === "keluar").reduce((s, l) => s + parseInt(l.jumlah || 0, 10), 0);
   const riwayatTerfilter = riwayatLogs.filter(l => filterRiwayat === "semua" || l.tipe_transaksi === filterRiwayat);
   const dataTabelTerfilter = dataBarang.filter(b => b.nama_barang?.toLowerCase().includes(cari.toLowerCase()));

   return (
      <div className="space-y-6 select-none">
         <style>{`
            @keyframes melayangNaik {
               0% { opacity: 0; transform: translateY(10px) scale(0.8); }
               20% { opacity: 1; transform: translateY(-5px) scale(1.1); }
               80% { opacity: 1; transform: translateY(-15px) scale(1); }
               100% { opacity: 0; transform: translateY(-25px) scale(0.9); }
            }
            .efek-siluet-naik { animation: melayangNaik 2s ease-in-out forwards; }
         `}</style>

         {/* HEADER */}
         <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#222226] pb-5">
            <div>
               <h2 className="text-xl font-medium tracking-tight text-[#f0f0f0] font-mono">Gudang Logistik</h2>
               <p className="text-[11px] text-[#444] mt-0.5 font-mono tracking-wide">Pantau ketersediaan inventaris barang dan log mutasi secara real-time.</p>
            </div>
            <button
               onClick={() => {
                  bersihkanForm();
                  setIsModalOpen(true);
               }}
               className="flex items-center gap-2 bg-[#f5a623] hover:bg-[#e09520] text-[#111] text-[11px] font-bold px-4 py-2.5 font-mono uppercase tracking-[0.08em] transition-all active:scale-95 duration-150">
               <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
               Tambah Barang Baru
            </button>
         </header>

         {/* 3 CARDS STATS DENGAN DIRECT REF & ANIMASI PERSIS DASHBOARD */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1: Total Ragam Produk */}
            <div
               ref={totalProdukParallaxRef}
               className="bg-[#161618] border border-[#222226] p-5 flex items-center justify-between group hover:border-[#f5a623]/40 transition-all duration-200 overflow-hidden relative"
               style={{
                  transform: "perspective(1000px) rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 5deg))",
                  transition: "transform 0.15s ease-out, border-color 0.2s",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
               }}>
               <div style={{ transform: "translateZ(20px)" }}>
                  <p className="text-[9px] font-mono text-[#444] uppercase tracking-[0.12em]">Total Ragam Produk</p>
                  <h4 className="text-2xl font-medium mt-1.5 font-mono text-[#f0f0f0]">
                     {totalSKU} <span className="text-[11px] font-normal text-[#444]">SKU</span>
                  </h4>
               </div>
               <div style={{ transform: "translateZ(30px)" }} className="p-2.5 bg-[#1e1e21] border border-[#2a2a2e] text-[#555] group-hover:text-[#f5a623] group-hover:border-[#f5a623]/30 transition-colors duration-300">
                  <FontAwesomeIcon icon={faBoxes} className="text-sm" />
               </div>
            </div>

            {/* Card 2: Volume Masuk */}
            <div
               ref={volumeMasukParallaxRef}
               className="bg-[#161618] border border-[#222226] p-5 flex items-center justify-between group hover:border-[#22c55e]/30 transition-all duration-200 overflow-hidden relative"
               style={{
                  transform: "perspective(1000px) rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 5deg))",
                  transition: "transform 0.15s ease-out, border-color 0.2s",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
               }}>
               <div style={{ transform: "translateZ(20px)" }}>
                  <p className="text-[9px] font-mono text-[#444] uppercase tracking-[0.12em]">Volume Masuk (3 Bln)</p>
                  <h4 className="text-2xl font-medium mt-1.5 font-mono text-[#22c55e]">
                     +{totalMasuk3Bulan} <span className="text-[11px] font-normal text-[#444]">Units</span>
                  </h4>
               </div>
               <div style={{ transform: "translateZ(30px)" }} className="p-2.5 bg-[#1e1e21] border border-[#2a2a2e] text-[#555] group-hover:text-[#22c55e] group-hover:border-[#22c55e]/30 transition-colors duration-300">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-sm" />
               </div>
            </div>

            {/* Card 3: Volume Keluar */}
            <div
               ref={volumeKeluarParallaxRef}
               className="bg-[#161618] border border-[#222226] p-5 flex items-center justify-between group hover:border-[#e24b4a]/30 transition-all duration-200 overflow-hidden relative"
               style={{
                  transform: "perspective(1000px) rotateX(calc(var(--my) * -5deg)) rotateY(calc(var(--mx) * 5deg))",
                  transition: "transform 0.15s ease-out, border-color 0.2s",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
               }}>
               <div style={{ transform: "translateZ(20px)" }}>
                  <p className="text-[9px] font-mono text-[#444] uppercase tracking-[0.12em]">Volume Keluar (3 Bln)</p>
                  <h4 className="text-2xl font-medium mt-1.5 font-mono text-[#e24b4a]">
                     -{totalKeluar3Bulan} <span className="text-[11px] font-normal text-[#444]">Units</span>
                  </h4>
               </div>
               <div style={{ transform: "translateZ(30px)" }} className="p-2.5 bg-[#1e1e21] border border-[#2a2a2e] text-[#555] group-hover:text-[#e24b4a] group-hover:border-[#e24b4a]/30 transition-colors duration-300">
                  <FontAwesomeIcon icon={faArrowTrendDown} className="text-sm" />
               </div>
            </div>
         </div>

         {/* TABEL + RIWAYAT */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Panel Tabel */}
            <div className="lg:col-span-2 space-y-3">
               <div className="bg-[#161618] border border-[#222226] p-2.5">
                  <div className="relative">
                     <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-[11px]" />
                     <input type="text" placeholder="Cari nama barang di gudang..." value={cari} onChange={e => setCari(e.target.value)} className="w-full bg-[#111113] border border-[#222226] pl-8 pr-3 py-2 outline-none text-[11px] font-mono text-[#ccc] placeholder-[#333] focus:border-[#f5a623]/40 transition-colors" />
                  </div>
               </div>

               <div className="bg-[#161618] border border-[#222226] overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="border-b border-[#222226] bg-[#111113]">
                           <tr>
                              {["No", "Nama Logistik", "Kategori", "Stok Fisik", "Kontrol"].map((h, i) => (
                                 <th key={h} className={`p-3.5 text-[9px] font-mono text-[#444] uppercase tracking-[0.1em] ${i === 0 ? "text-center w-12" : i === 3 ? "text-center w-32" : i === 4 ? "text-right" : ""}`}>
                                    {h}
                                 </th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1e21] text-[11px] font-mono">
                           {dataTabelTerfilter.map((item, index) => {
                              const sedangAnimasi = animasiStok.id === item.id;
                              return (
                                 <tr key={item.id} className="hover:bg-[#1a1a1d] transition-colors duration-100">
                                    <td className="p-3.5 text-center text-[#444]">{index + 1}</td>
                                    <td className="p-3.5 text-[#ccc] font-medium">{item.nama_barang}</td>
                                    <td className="p-3.5">
                                       <span className="bg-[#1e1e21] border border-[#2a2a2e] px-2 py-0.5 text-[#555] text-[10px]">{item.nama_kategori || "Umum"}</span>
                                    </td>
                                    <td className="p-3.5 text-center relative font-bold text-[#f0f0f0]">
                                       {sedangAnimasi && <span className={`absolute left-1/2 -translate-x-1/2 text-[11px] font-bold efek-siluet-naik z-10 ${animasiStok.tipe === "masuk" ? "text-[#22c55e]" : "text-[#e24b4a]"}`}>{animasiStok.teks}</span>}
                                       <span className={`transition-all duration-300 ${sedangAnimasi ? (animasiStok.tipe === "masuk" ? "text-[#22c55e]" : "text-[#e24b4a]") : ""}`}>{item.stok} Unit</span>
                                    </td>
                                    <td className="p-3.5 text-right font-sans">
                                       <button
                                          onClick={() => {
                                             setEditId(item.id);
                                             setNama(item.nama_barang);
                                             setStok("");
                                             setStokAwalSaatEdit(parseInt(item.stok || 0, 10));
                                             setKategori(item.kategori_id || "");
                                             setTipeTransaksi("edit_data");
                                             setIsModalOpen(true);
                                          }}
                                          className="text-[#444] hover:text-[#f5a623] transition-colors px-1">
                                          <FontAwesomeIcon icon={faEdit} className="text-[11px]" />
                                       </button>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Panel Riwayat Perubahan */}
            <div className="space-y-3">
               <h3 className="text-[9px] font-mono text-[#444] uppercase tracking-[0.12em] flex items-center gap-2">
                  <FontAwesomeIcon icon={faHistory} /> Riwayat Perubahan Stok
               </h3>
               <div className="bg-[#161618] border border-[#222226] p-4 space-y-3">
                  <div className="grid grid-cols-3 bg-[#111113] border border-[#222226] p-1 text-[10px] font-mono text-center">
                     {["semua", "masuk", "keluar"].map(t => (
                        <button key={t} onClick={() => setFilterRiwayat(t)} className={`py-1.5 uppercase tracking-wide transition-all ${filterRiwayat === t ? "bg-[#f5a623] text-[#111]" : "text-[#444] hover:text-[#ccc]"}`}>
                           {t}
                        </button>
                     ))}
                  </div>

                  <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                     {riwayatTerfilter.length > 0 ? (
                        riwayatTerfilter.map(log => {
                           const isMasuk = log.tipe_transaksi === "masuk";
                           return (
                              <div key={log.id} className="p-3 bg-[#111113] border border-[#1e1e21] flex items-start gap-3 hover:border-[#2a2a2e] transition-colors">
                                 <div className={`p-2 text-[11px] flex-shrink-0 ${isMasuk ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#e24b4a]/10 text-[#e24b4a]"}`}>
                                    <FontAwesomeIcon icon={isMasuk ? faPlus : faBoxes} />
                                 </div>
                                 <div className="flex-1 space-y-0.5 text-[11px] font-mono min-w-0">
                                    <div className="flex justify-between items-center gap-2">
                                       <strong className="text-[#ccc] truncate">{log.nama_barang}</strong>
                                       <span className={`font-bold flex-shrink-0 ${isMasuk ? "text-[#22c55e]" : "text-[#e24b4a]"}`}>
                                          {isMasuk ? "+" : "-"}
                                          {log.jumlah} Unit
                                       </span>
                                    </div>
                                    {log.catatan && <p className="text-[#444] text-[10px] italic">"{log.catatan}"</p>}
                                    <div className="text-[#333] text-[10px] flex items-center gap-1 pt-0.5">
                                       <FontAwesomeIcon icon={faClock} className="text-[9px]" />
                                       {log.dibuat_pada}
                                    </div>
                                 </div>
                              </div>
                           );
                        })
                     ) : (
                        <p className="text-center text-[#333] py-8 text-[10px] font-mono">Belum ada rekaman log mutasi.</p>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* MODAL */}
         {isModalOpen && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
               <div className="bg-[#161618] border border-[#222226] w-full max-w-md p-6 text-[#f0f0f0] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 border-b border-[#222226] pb-4">
                     <h2 className="text-[12px] font-medium font-mono tracking-wider">{editId ? "Pusat Kontrol Stok" : "Registrasi SKU Baru"}</h2>
                     <button onClick={() => setIsModalOpen(false)} className="text-[#444] hover:text-[#ccc] transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="text-[11px]" />
                     </button>
                  </div>

                  <form onSubmit={simpanBarang} className="space-y-4 text-[11px] font-mono">
                     {editId && (
                        <div>
                           <label className="block text-[9px] text-[#444] uppercase tracking-[0.1em] mb-1.5">Pilih Modul Transaksi</label>
                           <div className="grid grid-cols-3 border border-[#222226] p-1 bg-[#111113] gap-px">
                              {[
                                 { id: "edit_data", label: "Ubah Info" },
                                 { id: "masuk", label: "Masuk (+)" },
                                 { id: "keluar", label: "Keluar (-)" },
                              ].map(t => (
                                 <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => {
                                       setTipeTransaksi(t.id);
                                       setStok("");
                                    }}
                                    className={`py-2 text-[10px] text-center uppercase tracking-wide transition-all ${tipeTransaksi === t.id ? (t.id === "masuk" ? "bg-[#22c55e] text-[#111]" : t.id === "keluar" ? "bg-[#e24b4a] text-white" : "bg-[#f5a623] text-[#111]") : "text-[#444] hover:text-[#ccc]"}`}>
                                    {t.label}
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}

                     {tipeTransaksi === "edit_data" || !editId ? (
                        <div>
                           <label className="block text-[9px] text-[#444] uppercase tracking-[0.1em] mb-1.5">Nama Deskripsi Barang</label>
                           <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Masukkan nama produk..." className="w-full bg-[#111113] border border-[#222226] p-3 outline-none text-[#ccc] placeholder-[#333] focus:border-[#f5a623]/40 transition-colors" required />
                        </div>
                     ) : (
                        <div className="bg-[#111113] border border-[#222226] p-3">
                           <p className="text-[9px] text-[#444] uppercase tracking-wide">Target Produk</p>
                           <p className="text-[12px] font-medium mt-0.5 text-[#f0f0f0]">{nama}</p>
                           <p className="text-[10px] text-[#444] mt-1">Stok Saat Ini: {stokAwalSaatEdit} unit</p>
                        </div>
                     )}

                     {(tipeTransaksi === "edit_data" || !editId) && (
                        <div className="relative">
                           <label className="block text-[9px] text-[#444] uppercase tracking-[0.1em] mb-1.5">Kategori Produk</label>
                           <Listbox value={kategori} onChange={setKategori}>
                              <div className="relative">
                                 <Listbox.Button className="w-full bg-[#111113] border border-[#222226] p-3 text-left text-[#ccc] focus:border-[#f5a623]/40">{kategori ? listKategori.find(k => k.id === kategori)?.nama_kategori : "Pilih Kategori"}</Listbox.Button>
                                 <Listbox.Options className="absolute mt-1 w-full bg-[#161618] border border-[#222226] z-50 max-h-40 overflow-y-auto divide-y divide-[#1e1e21] shadow-xl">
                                    {listKategori.map(k => (
                                       <Listbox.Option key={k.id} value={k.id} className="p-3 hover:bg-[#1e1e21] cursor-pointer text-[#ccc] text-[11px]">
                                          {k.nama_kategori}
                                       </Listbox.Option>
                                    ))}
                                 </Listbox.Options>
                              </div>
                           </Listbox>
                        </div>
                     )}

                     <div>
                        <label className="block text-[9px] text-[#444] uppercase tracking-[0.1em] mb-1.5">{tipeTransaksi === "masuk" ? "Jumlah Tambahan" : tipeTransaksi === "keluar" ? "Jumlah Pengurangan" : "Kuantitas Stok"}</label>
                        <input type="number" value={stok} onChange={e => setStok(e.target.value)} placeholder="0" className="w-full bg-[#111113] border border-[#222226] p-3 outline-none text-[#ccc] placeholder-[#333] focus:border-[#f5a623]/40 transition-colors" required />
                        {editId && stok && tipeTransaksi !== "edit_data" && (
                           <div className="mt-2 p-2 bg-[#111113] border border-[#1e1e21] text-[10px]">
                              Kalkulasi:{" "}
                              <span className={tipeTransaksi === "masuk" ? "text-[#22c55e]" : "text-[#e24b4a]"}>
                                 {stokAwalSaatEdit} {tipeTransaksi === "masuk" ? "+" : "-"} {stok} = {dapatkanStokAkhir()} Unit
                              </span>
                           </div>
                        )}
                     </div>

                     {tipeTransaksi !== "edit_data" && (
                        <div>
                           <label className="block text-[9px] text-[#444] uppercase tracking-[0.1em] mb-1.5">Catatan Alasan</label>
                           <textarea rows="2" value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Tulis alasan mutasi stok..." className="w-full bg-[#111113] border border-[#222226] p-3 outline-none text-[#ccc] placeholder-[#333] resize-none focus:border-[#f5a623]/40 transition-colors" />
                        </div>
                     )}

                     <button type="submit" disabled={isLoading} className="w-full bg-[#f5a623] hover:bg-[#e09520] text-[#111] py-3 font-bold uppercase tracking-[0.1em] transition-colors duration-150 disabled:opacity-50">
                        {isLoading ? "Sinkronisasi..." : "Eksekusi Simpan"}
                     </button>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
