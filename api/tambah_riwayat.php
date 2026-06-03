<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include 'koneksi.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (isset($input['barang_id']) && isset($input['tipe_transaksi']) && isset($input['jumlah'])) {
    $barang_id = $input['barang_id'];
    $nama_barang = $input['nama_barang'];
    $tipe = $input['tipe_transaksi'];
    $jumlah = $input['jumlah'];
    $catatan = $input['catatan'];

    $query = mysqli_query($koneksi, "INSERT INTO riwayat_mutasi (barang_id, nama_barang, tipe_transaksi, jumlah, catatan) 
        VALUES ('$barang_id', '$nama_barang', '$tipe', '$jumlah', '$catatan')");

    if ($query) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
    }
}
?>