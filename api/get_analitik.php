<?php
include 'koneksi.php'; 

$sql = "SELECT k.nama_kategori as name, COUNT(b.id) as value 
        FROM kategori k 
        LEFT JOIN barang b ON k.id = b.kategori_id 
        GROUP BY k.id";

$result = mysqli_query($koneksi, $sql);
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
   $data[] = [
      "name" => strtoupper($row['name']),
      "value" => (int) $row['value']
   ];
}

echo json_encode($data);
?>