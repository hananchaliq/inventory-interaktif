<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Mengantisipasi jika ada request OPTIONS dari browser (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
   http_response_code(200);
   exit();
}

include "koneksi.php"; // <--- Pastikan nama file koneksi lu sudah benar

// QUERY UPGRADE: Menggabungkan tabel kategori dan barang berdasarkan relasi kategori_id
$query = "SELECT 
            kategori.id, 
            kategori.nama_kategori, 
            COUNT(barang.id) AS total_barang 
          FROM kategori 
          LEFT JOIN barang ON kategori.id = barang.kategori_id 
          GROUP BY kategori.id 
          ORDER BY kategori.id DESC";

$result = mysqli_query($koneksi, $query);

if ($result) {
   $list_kategori = [];

   while ($row = mysqli_fetch_assoc($result)) {
      // Cast string dari database menjadi integer murni supaya dibaca number oleh JavaScript
      $row['id'] = (int) $row['id'];
      $row['total_barang'] = (int) $row['total_barang'];

      $list_kategori[] = $row;
   }

   http_response_code(200);
   echo json_encode($list_kategori);
} else {
   // Jika query gagal, return error 500 dan beri tahu detail error SQL-nya
   http_response_code(500);
   echo json_encode([
      "status" => "error",
      "message" => "Gagal mengeksekusi query database.",
      "error_details" => mysqli_error($koneksi)
   ]);
}
?>