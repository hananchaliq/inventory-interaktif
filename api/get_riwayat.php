<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'koneksi.php';

$query = mysqli_query($koneksi, "SELECT * FROM riwayat_mutasi ORDER BY dibuat_pada DESC LIMIT 30");
$data = [];

while ($row = mysqli_fetch_assoc($query)) {
    $data[] = $row;
}

echo json_encode($data);
?>