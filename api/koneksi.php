<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
   http_response_code(200);
   exit();
}

$koneksi = mysqli_connect('localhost', 'root', '', 'inventory_interaktif', 3306);

if (!$koneksi) {
   die(json_encode(["error" => "Koneksi database gagal"]));
}

mysqli_set_charset($koneksi, "utf8mb4");