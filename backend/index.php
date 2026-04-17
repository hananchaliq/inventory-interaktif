<?php
include 'koneksi.php'; 

$sql = "SELECT barang.*, kategori.nama_kategori 
FROM barang 
LEFT JOIN kategori ON barang.kategori_id = kategori.id";
$query = mysqli_query($koneksi, $sql);
$barang = [];

while ($row = mysqli_fetch_assoc($query)) {
   $row['stok'] = (int) $row['stok'];
   $barang[] = $row;
}

echo json_encode($barang);