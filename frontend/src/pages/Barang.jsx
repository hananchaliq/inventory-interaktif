import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.VITE_API_URL;

const Toast = Swal.mixin({
   toast: true,
   position: "top-end",
   showConfirmButton: false,
   timer: 2000,
   timerProgressBar: true,
   background: "#18181b",
   color: "#f4f4f5",
});

export default function Barang() {
   const [dataBarang, setDataBarang] = useState([]);
   const [nama, setNama] = useState("");
   const [stok, setStok] = useState("");
   const [kategori, setKategori] = useState("");
   const [listKategori, setListKategori] = useState([]);
   const [cari, setCari] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editId, setEditId] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const ambilKategori = async () => {
      try {
         const res = await fetch(`${apiUrl}get_kategori.php`);
         const hasil = await res.json();
         setListKategori(hasil);
      } catch (err) {
         console.error("Gagal load kategori:", err);
      }
   };

   const ambilData = async () => {
      try {
         const res = await fetch(`${apiUrl}index.php`);
         const hasil = await res.json();
         setDataBarang(hasil);
      } catch (err) {
         console.error("Gagal load data barang:", err);
      }
   };

   const simpanBarang = async e => {
      e.preventDefault();

      // Validasi Sederhana
      if (parseInt(stok) < 0) {
         return Toast.fire({ icon: "error", title: "Stok tidak boleh negatif!" });
      }

      setIsLoading(true);
      const payload = {
         id: editId,
         nama_barang: nama,
         stok: parseInt(stok),
         kategori_id: kategori,
      };

      const url = editId ? "edit_barang.php" : "tambah_barang.php";

      try {
         const res = await fetch(`${apiUrl}${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         });

         const hasil = await res.json();

         if (hasil.status === "success") {
            Toast.fire({ icon: "success", title: editId ? "Berhasil Update!" : "Berhasil Tambah!" });
            setIsModalOpen(false);
            bersihkanForm();
            ambilData();
         } else {
            Toast.fire({ icon: "error", title: hasil.message || "Gagal menyimpan data" });
         }
      } catch (err) {
         Toast.fire({ icon: "error", title: "Terjadi kesalahan koneksi" });
      } finally {
         setIsLoading(false);
      }
   };

   const hapusBarang = async id => {
      const confirm = await Swal.fire({
         title: "Hapus Barang?",
         text: "Data yang dihapus tidak bisa dikembalikan!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#ef4444",
         cancelButtonColor: "#3f3f46",
         confirmButtonText: "Ya, Hapus!",
         background: "#18181b",
         color: "#f4f4f5",
      });

      if (confirm.isConfirmed) {
         try {
            const res = await fetch(`${apiUrl}hapus_barang.php`, {
               method: "DELETE",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ id }),
            });
            const hasil = await res.json();

            if (hasil.status === "success") {
               Toast.fire({ icon: "success", title: "Terhapus!" });
               ambilData();
            }
         } catch (err) {
            console.error(err);
         }
      }
   };

   const bersihkanForm = () => {
      setEditId(null);
      setNama("");
      setStok("");
      setKategori("");
   };

   useEffect(() => {
      ambilData();
      ambilKategori();
   }, []);

   return (
      <div className="animate-in fade-in duration-500">
         <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-black italic border-l-4 border-amber-500 pl-4 uppercase">Gudang Stok</h2>
            <div className="flex gap-3 w-full md:w-auto">
               <div className="relative flex-1">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input type="text" placeholder="Cari barang..." value={cari} onChange={e => setCari(e.target.value)} className="bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 rounded-2xl w-full outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
               </div>
               <button
                  onClick={() => {
                     bersihkanForm();
                     setIsModalOpen(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 rounded-2xl font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                  <FontAwesomeIcon icon={faPlus} />
               </button>
            </div>
         </header>

         <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-800/50">
                     <tr>
                        <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase">Informasi Barang</th>
                        <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase text-center">Kategori</th>
                        <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase text-center">Stok</th>
                        <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase text-right">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                     {dataBarang.filter(i => i.nama_barang.toLowerCase().includes(cari.toLowerCase())).length > 0 ? (
                        dataBarang
                           .filter(i => i.nama_barang.toLowerCase().includes(cari.toLowerCase()))
                           .map(item => (
                              <tr key={item.id} className="hover:bg-zinc-800/30 transition-all">
                                 <td className="p-6">
                                    <p className="font-bold text-zinc-200 uppercase tracking-tight leading-none mb-1">{item.nama_barang}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono tracking-widest">ID: {item.id}</p>
                                 </td>
                                 <td className="p-6 text-center">
                                    <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 font-bold uppercase">{item.nama_kategori || "UMUM"}</span>
                                 </td>
                                 <td className={`p-6 text-center text-sm font-black ${item.stok < 10 ? "text-red-500" : "text-amber-500"}`}>
                                    {item.stok} <span className="text-[10px] text-zinc-600 font-medium">PCS</span>
                                 </td>
                                 <td className="p-6 text-right space-x-4">
                                    <button
                                       onClick={() => {
                                          setEditId(item.id);
                                          setNama(item.nama_barang);
                                          setStok(item.stok);
                                          setKategori(item.kategori_id);
                                          setIsModalOpen(true);
                                       }}
                                       className="text-zinc-600 hover:text-amber-500 transition-colors">
                                       <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => hapusBarang(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                       <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                 </td>
                              </tr>
                           ))
                     ) : (
                        <tr>
                           <td colSpan="4" className="p-12 text-center text-zinc-600 italic font-medium">
                              Data barang tidak ditemukan...
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* MODAL FORM */}
         {isModalOpen && (
            <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
               <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-8 rounded-[2.5rem] relative shadow-2xl animate-in zoom-in-95 duration-200">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
                     <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                  <h2 className="text-2xl font-black mb-8 italic tracking-tighter uppercase underline decoration-amber-500 decoration-4 underline-offset-8">{editId ? "Edit" : "Tambah"} Data</h2>
                  <form onSubmit={simpanBarang} className="space-y-5">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase ml-1">Nama Barang</label>
                        <input type="text" required value={nama} onChange={e => setNama(e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all text-zinc-100" placeholder="Masukkan nama barang..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase ml-1">Kategori</label>
                        <select required value={kategori} onChange={e => setKategori(e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all text-zinc-100 appearance-none">
                           <option value="">Pilih Kategori</option>
                           {listKategori.map(kat => (
                              <option key={kat.id} value={kat.id}>
                                 {kat.nama_kategori}
                              </option>
                           ))}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase ml-1">Jumlah Stok</label>
                        <input type="number" required value={stok} onChange={e => setStok(e.target.value)} className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all text-zinc-100" placeholder="0" />
                     </div>
                     <button type="submit" disabled={isLoading} className="w-full bg-amber-500 disabled:bg-zinc-700 text-zinc-950 font-black py-4 rounded-2xl hover:bg-white transition-all shadow-xl shadow-amber-500/10 mt-4 uppercase tracking-widest">
                        {isLoading ? "Memproses..." : editId ? "Update Data" : "Simpan Data"}
                     </button>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
