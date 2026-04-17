<?php 

include 'koneksi.php'; 

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (isset($input['id']) && isset($input['nama_kategori'])) {
   $id = $input['id'];
   $nama = $input['nama_kategori'];

   $query = mysqli_query($koneksi, "UPDATE kategori SET 
        nama_kategori = '$nama' 
        WHERE id = '$id'");

   if ($query) {
      echo json_encode(["status" => "sukses", "message" => "Kategori berhasil diperbarui"]);
   } else {
      echo json_encode(["status" => "gagal", "message" => mysqli_error($koneksi)]);
   }
}

?>