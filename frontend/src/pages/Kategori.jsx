import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faLayerGroup, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
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

export default function Kategori() {
   const [listKategori, setListKategori] = useState([]);
   const [namaKategori, setNamaKategori] = useState("");
   const [cari, setCari] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editId, setEditId] = useState(null);

   const ambilKategori = async () => {
      try {
         const res = await fetch(`${apiUrl}get_kategori.php`);
         const hasil = await res.json();
         setListKategori(hasil);
      } catch (err) {
         console.error("Gagal tarik kategori:", err);
      }
   };

   const simpanKategori = async e => {
      e.preventDefault();
      // Sesuaikan dengan nama file backend lu nanti (misal: tambah_kategori.php)
      const url = editId ? "edit_kategori.php" : "tambah_kategori.php";

      try {
         const res = await fetch(`${apiUrl}${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editId, nama_kategori: namaKategori }),
         });

         if (res.ok) {
            Toast.fire({ icon: "success", title: "Kategori Berhasil Disimpan!" });
            setIsModalOpen(false);
            setEditId(null);
            setNamaKategori("");
            ambilKategori();
         }
      } catch (err) {
         Toast.fire({ icon: "error", title: "Gagal API" });
      }
   };

   const hapusKategori = async id => {
      const result = await Swal.fire({
         title: "Hapus Kategori?",
         text: "Sistem akan mengecek relasi data sebelum menghapus.",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#f59e0b",
         background: "#18181b",
         color: "#f4f4f5",
      });

      if (result.isConfirmed) {
         try {
            const res = await fetch(`${apiUrl}hapus_kategori.php`, {
               method: "DELETE",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ id }),
            });

            const data = await res.json(); // Ambil respon asli dari PHP

            // CEK STATUS ASLI DARI DATABASE
            if (data.status === "success") {
               Toast.fire({ icon: "success", title: "Kategori Terhapus!" });
               ambilKategori(); // Refresh data yang beneran update
            } else {
               // INI YANG AKAN MUNCUL KALAU DIPAKAI DI DATA BARANG
               Swal.fire({
                  icon: "error",
                  title: "Gagal Menghapus!",
                  text: data.message || "Data ini sedang digunakan di tabel barang.",
                  background: "#18181b",
                  color: "#f4f4f5",
               });
            }
         } catch (err) {
            Toast.fire({ icon: "error", title: "Terjadi kesalahan koneksi" });
         }
      }
   };

   useEffect(() => {
      ambilKategori();
   }, []);

   return (
      <div className="animate-in fade-in duration-500">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic border-l-4 border-blue-500 pl-4 uppercase">Manajemen Kategori</h2>
            <button
               onClick={() => {
                  setEditId(null);
                  setNamaKategori("");
                  setIsModalOpen(true);
               }}
               className="bg-blue-600 hover:bg-blue-500 text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-500/20">
               <FontAwesomeIcon icon={faPlus} /> TAMBAH KATEGORI
            </button>
         </div>

         <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
               <thead className="bg-zinc-800/50">
                  <tr>
                     <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID</th>
                     <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nama Kategori</th>
                     <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800">
                  {listKategori.map(kat => (
                     <tr key={kat.id} className="hover:bg-zinc-800/30 transition-all group">
                        <td className="p-6 text-zinc-600 font-mono text-xs">#{kat.id}</td>
                        <td className="p-6 font-bold text-zinc-200 uppercase tracking-tight">{kat.nama_kategori}</td>
                        <td className="p-6 text-right space-x-5">
                           <button
                              onClick={() => {
                                 setEditId(kat.id);
                                 setNamaKategori(kat.nama_kategori);
                                 setIsModalOpen(true);
                              }}
                              className="text-zinc-500 hover:text-blue-500 transition-all hover:scale-125">
                              <FontAwesomeIcon icon={faEdit} />
                           </button>
                           <button onClick={() => hapusKategori(kat.id)} className="text-zinc-500 hover:text-red-500 transition-all hover:scale-125">
                              <FontAwesomeIcon icon={faTrash} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* MODAL KATEGORI */}
         {isModalOpen && (
            <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
               <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-8 rounded-[2.5rem] relative">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-500">
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <h2 className="text-xl font-black mb-6 italic underline decoration-blue-500">{editId ? "EDIT" : "TAMBAH"} KATEGORI</h2>
                  <form onSubmit={simpanKategori} className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2">Nama Kategori</label>
                        <input type="text" required value={namaKategori} onChange={e => setNamaKategori(e.target.value)} className="w-full bg-zinc-800 p-4 rounded-xl outline-none border border-zinc-700 focus:border-blue-500" placeholder="Contoh: Elektronik, Alat Tulis, dll" />
                     </div>
                     <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                        SIMPAN KATEGORI
                     </button>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
