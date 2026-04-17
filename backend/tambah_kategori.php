<?php

include 'koneksi.php'; 

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (isset($input['nama_kategori'])) {
   $nama = $input['nama_kategori'];

   $query = mysqli_query($koneksi, "INSERT INTO kategori (nama_kategori) VALUES ('$nama')");

   if ($query) {
      echo json_encode(["status" => "success", "message" => "Kategori berhasil ditambahkan"]);
   } else {
      echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
   }
}

?>