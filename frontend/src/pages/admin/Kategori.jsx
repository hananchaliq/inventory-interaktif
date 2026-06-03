import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faTimes, faSearch, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.VITE_API_URL;

const Toast = Swal.mixin({
   toast: true,
   position: "top-end",
   showConfirmButton: false,
   timer: 2000,
   background: "#161618",
   color: "#f0f0f0",
});

export default function Kategori() {
   const [listKategori, setListKategori] = useState([]);
   const [namaKategori, setNamaKategori] = useState("");
   const [cari, setCari] = useState("");
   const [editId, setEditId] = useState(null);

   const ambilKategori = async () => {
      try {
         const res = await fetch(`${apiUrl}get_kategori.php`);
         setListKategori(await res.json());
      } catch (err) {
         console.error("Gagal tarik kategori:", err);
      }
   };

   const simpanKategori = async e => {
      e.preventDefault();
      const url = editId ? "edit_kategori.php" : "tambah_kategori.php";
      try {
         const res = await fetch(`${apiUrl}${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editId, nama_kategori: namaKategori }),
         });
         if (res.ok) {
            Toast.fire({ icon: "success", title: editId ? "Kategori Diperbarui!" : "Kategori Disimpan!" });
            setEditId(null);
            setNamaKategori("");
            ambilKategori();
         }
      } catch {
         Toast.fire({ icon: "error", title: "Gagal API" });
      }
   };

   const hapusKategori = async id => {
      const result = await Swal.fire({
         title: "Hapus Kategori?",
         text: "Sistem akan mengecek relasi data sebelum menghapus.",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#f5a623",
         background: "#161618",
         color: "#f0f0f0",
      });
      if (result.isConfirmed) {
         try {
            const res = await fetch(`${apiUrl}hapus_kategori.php`, {
               method: "DELETE",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data.status === "success") {
               Toast.fire({ icon: "success", title: "Kategori Terhapus!" });
               if (editId === id) {
                  setEditId(null);
                  setNamaKategori("");
               }
               ambilKategori();
            } else {
               Swal.fire({ icon: "error", title: "Gagal Menghapus!", text: data.message || "Data sedang digunakan.", background: "#161618", color: "#f0f0f0" });
            }
         } catch {
            Toast.fire({ icon: "error", title: "Kesalahan koneksi" });
         }
      }
   };

   useEffect(() => {
      ambilKategori();
   }, []);

   const kategoriTersaring = listKategori.filter(kat => kat.nama_kategori?.toLowerCase().includes(cari.toLowerCase()));

   return (
      <div className="space-y-6">
         {/* HEADER */}
         <div className="border-b border-[#222226] pb-5">
            <h2 className="text-xl font-medium tracking-tight text-[#f0f0f0] font-mono">Klaster Kategori</h2>
            <p className="text-[11px] text-[#444] mt-0.5 font-mono tracking-wide">Manajemen pembagian kelompok rumpun produk dan klasifikasi data logistik.</p>
         </div>

         {/* SPLIT GRID */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* TABEL KIRI */}
            <div className="lg:col-span-2 space-y-3">
               <div className="bg-[#161618] border border-[#222226] p-2.5">
                  <div className="relative">
                     <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-[11px]" />
                     <input type="text" placeholder="Cari klaster kategori..." value={cari} onChange={e => setCari(e.target.value)} className="w-full bg-[#111113] border border-[#222226] pl-8 pr-3 py-2 outline-none text-[11px] font-mono text-[#ccc] placeholder-[#333] focus:border-[#f5a623]/40 transition-colors" />
                  </div>
               </div>

               <div className="bg-[#161618] border border-[#222226] overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="border-b border-[#222226] bg-[#111113]">
                           <tr>
                              <th className="p-3.5 text-[9px] font-mono text-[#444] uppercase tracking-[0.1em] text-center w-16">No</th>
                              <th className="p-3.5 text-[9px] font-mono text-[#444] uppercase tracking-[0.1em]">Nama Rumpun</th>
                              <th className="p-3.5 text-[9px] font-mono text-[#444] uppercase tracking-[0.1em] text-center w-36">Kuantitas SKU</th>
                              <th className="p-3.5 text-[9px] font-mono text-[#444] uppercase tracking-[0.1em] text-right w-24">Kontrol</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1e21] text-[11px] font-mono">
                           {kategoriTersaring.length === 0 ? (
                              <tr>
                                 <td colSpan="4" className="p-12 text-center text-[#333]">
                                    <div className="flex flex-col items-center gap-2">
                                       <FontAwesomeIcon icon={faFolderOpen} className="text-xl text-[#2a2a2e]" />
                                       <p>Tidak ada rekaman klaster ditemukan</p>
                                    </div>
                                 </td>
                              </tr>
                           ) : (
                              kategoriTersaring.map((kat, index) => (
                                 <tr key={kat.id} className="hover:bg-[#1a1a1d] transition-colors duration-100">
                                    <td className="p-3.5 text-center text-[#444]">{index + 1}</td>
                                    <td className="p-3.5 text-[#ccc] font-medium">{kat.nama_kategori}</td>
                                    <td className="p-3.5 text-center text-[#f0f0f0] font-bold">
                                       {kat.total_barang ?? 0}
                                       <span className="text-[9px] font-normal text-[#444] ml-1.5 uppercase tracking-wide">SKU</span>
                                    </td>
                                    <td className="p-3.5 text-right">
                                       <div className="flex justify-end gap-3">
                                          <button
                                             onClick={() => {
                                                setEditId(kat.id);
                                                setNamaKategori(kat.nama_kategori);
                                             }}
                                             className="text-[#444] hover:text-[#f5a623] transition-colors">
                                             <FontAwesomeIcon icon={faEdit} className="text-[11px]" />
                                          </button>
                                          <button onClick={() => hapusKategori(kat.id)} className="text-[#444] hover:text-[#e24b4a] transition-colors">
                                             <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* FORM KANAN */}
            <div className="bg-[#161618] border border-[#222226] p-5 space-y-4">
               <div className="flex justify-between items-center pb-3 border-b border-[#222226]">
                  <div>
                     <p className="text-[9px] font-mono text-[#444] uppercase tracking-[0.1em]">{editId ? "Modification State" : "Registration State"}</p>
                     <p className="text-[12px] font-medium text-[#f0f0f0] font-mono mt-0.5">{editId ? `Edit ID #${editId}` : "Entri Klaster Baru"}</p>
                  </div>
                  {editId && (
                     <button
                        onClick={() => {
                           setEditId(null);
                           setNamaKategori("");
                        }}
                        className="text-[9px] font-mono text-[#444] hover:text-[#ccc] flex items-center gap-1.5 bg-[#1e1e21] border border-[#2a2a2e] px-2.5 py-1.5 transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="text-[9px]" />
                        Batal
                     </button>
                  )}
               </div>

               <form onSubmit={simpanKategori} className="space-y-4">
                  <div>
                     <label className="block text-[9px] font-mono text-[#444] uppercase tracking-[0.1em] mb-1.5">Nama Kategori</label>
                     <input type="text" value={namaKategori} onChange={e => setNamaKategori(e.target.value)} placeholder="Masukkan nama klaster rumpun..." className="w-full bg-[#111113] border border-[#222226] p-3 outline-none text-[11px] font-mono text-[#ccc] placeholder-[#333] focus:border-[#f5a623]/40 transition-colors" required />
                  </div>

                  <button type="submit" className="w-full bg-[#f5a623] hover:bg-[#e09520] text-[#111] font-bold py-2.5 px-4 flex items-center justify-center gap-2 transition-colors duration-150 text-[10px] font-mono uppercase tracking-[0.1em]">
                     <FontAwesomeIcon icon={editId ? faEdit : faPlus} className="text-[9px]" />
                     {editId ? "Perbarui Kategori" : "Simpan Kategori Baru"}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}
