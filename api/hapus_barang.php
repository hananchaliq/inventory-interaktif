<?php
include 'koneksi.php'; 

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (isset($input['id'])) {
   $id = $input['id'];

   $query = mysqli_query($koneksi, "DELETE FROM barang WHERE id='$id'");

   if ($query) {
      echo json_encode(["status" => "sukses", "message" => "Barang berhasil dihapus"]);
   } else {
      echo json_encode(["status" => "gagal", "message" => mysqli_error($koneksi)]);
   }
}


?>