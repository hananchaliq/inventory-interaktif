<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "koneksi.php"; // Sesuaikan nama file koneksi db kamu

// Contoh query mengambil data user yang statusnya sedang login atau admin utama
$query = "SELECT username, nama, role FROM users WHERE role = 'admin' LIMIT 1";
$result = mysqli_query($koneksi, $query);

if ($row = mysqli_fetch_assoc($result)) {
   echo json_encode($row);
} else {
   echo json_encode([
      "nama_lengkap" => "Root Admin",
      "role" => "Super Admin Node"
   ]);
}
?>