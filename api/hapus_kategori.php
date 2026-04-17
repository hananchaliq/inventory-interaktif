<?php 
include 'koneksi.php'; 

error_reporting(0);
ini_set('display_errors', 0);

mysqli_report(MYSQLI_REPORT_OFF);

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if(isset($input['id'])) {
    $id = mysqli_real_escape_string($koneksi, $input['id']);

    $query = mysqli_query($koneksi, "DELETE FROM kategori WHERE id = '$id'");

    if ($query) {
        if (mysqli_affected_rows($koneksi) > 0) {
            echo json_encode(["status" => "success", "message" => "Kategori berhasil dihapus"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Data tidak ditemukan"]);
        }
    } else {
        // CEK ERROR FOREIGN KEY
        if (mysqli_errno($koneksi) == 1451) {
            echo json_encode([
                "status" => "error", 
                "message" => "Gagal! Kategori ini masih digunakan oleh data barang."
            ]);
        } else {
            echo json_encode([
                "status" => "error", 
                "message" => "Kesalahan Database: " . mysqli_error($koneksi)
            ]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
}
?>