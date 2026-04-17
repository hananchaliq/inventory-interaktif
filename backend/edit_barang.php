<?php
include 'koneksi.php'; 

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (isset($input['id']) && isset($input['nama_barang']) && isset($input['stok'])) {
   $id = $input['id'];
   $nama = $input['nama_barang'];
   $stok = $input['stok'];
   $kategori_id = $input['kategori_id'];

   $query = mysqli_query($koneksi, "UPDATE barang SET 
        nama_barang = '$nama', 
        stok = '$stok', 
        kategori_id = '$kategori_id' 
        WHERE id = '$id'");

   if ($query) {
      echo json_encode(["status" => "success", "message" => "Barang berhasil diperbarui"]);
   } else {
      echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
   }
}


?>