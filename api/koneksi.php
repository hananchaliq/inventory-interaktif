<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
   header("HTTP/1.1 200 OK");
   exit();
}

$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$db = getenv('DB_NAME') ?: 'inventory_interaktif';
$port = getenv('DB_PORT') ?: 3306;

$koneksi = mysqli_connect($host, $user, $pass, $db, $port);

if (!$koneksi) {
   error_log("Koneksi gagal: " . mysqli_connect_error());
   die(json_encode(["error" => "Internal Server Error"]));
}
mysqli_set_charset($conn, "utf8mb4");
?>