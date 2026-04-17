<?php
include 'koneksi.php'; 

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE); 

if (isset($input['nama_barang']) && isset($input['stok']) && isset($input['kategori_id'])) {
   $nama = $input['nama_barang'];
   $stok = $input['stok'];
   $kategori_id = $input['kategori_id'];


   $query = mysqli_query($koneksi, "INSERT INTO barang (nama_barang, stok, kategori_id) VALUES ('$nama', '$stok', '$kategori_id' )");

   if ($query) {
      echo json_encode(["status" => "success", "message" => "Barang berhasil ditambah"]);
   } else {
      echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
   }
}