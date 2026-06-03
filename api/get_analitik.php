<?php
// 1. Ambil konfigurasi database ($koneksi)
include_once "koneksi.php";

header("Content-Type: application/json; charset=UTF-8");

// Nyalakan error reporting internal tapi bypass ke JSON agar tidak memicu HTTP 500
error_reporting(E_ALL);
ini_set('display_errors', 0);

$range = isset($_GET['range']) ? $_GET['range'] : '3bulan';
$date_format = "%d %b";

// 2. PENYARINGAN RENTANG WAKTU
if ($range === 'custom') {
   $start = isset($_GET['start']) ? $_GET['start'] : date('Y-m-d');
   $end = isset($_GET['end']) ? $_GET['end'] : date('Y-m-d');
   $where_clause = "WHERE DATE(dibuat_pada) BETWEEN '$start' AND '$end'";
} else {
   switch ($range) {
      case 'hari':
         $interval = "INTERVAL 0 DAY";
         $date_format = "%H:%i";
         break;
      case '7hari':
         $interval = "INTERVAL 7 DAY";
         break;
      case '30hari':
         $interval = "INTERVAL 30 DAY";
         break;
      case '3bulan':
      default:
         $interval = "INTERVAL 3 MONTH";
         break;
   }
   $where_clause = "WHERE dibuat_pada >= DATE_SUB(NOW(), $interval)";
}

$data_analitik = [];

if ($koneksi) {
   // 3. QUERY REVISI STRUKTUR (Group By & Order By disamakan agar MySQL tidak crash)
   $query = "
        SELECT 
            DATE_FORMAT(dibuat_pada, '$date_format') AS tgl_label,
            SUM(CASE WHEN tipe_transaksi = 'masuk' THEN jumlah ELSE 0 END) AS total_masuk,
            SUM(CASE WHEN tipe_transaksi = 'keluar' THEN jumlah ELSE 0 END) AS total_keluar,
            DATE(dibuat_pada) AS tgl_grup
        FROM riwayat_mutasi
        $where_clause
        GROUP BY DATE(dibuat_pada), DATE_FORMAT(dibuat_pada, '$date_format')
        ORDER BY tgl_grup ASC
    ";

   $result = mysqli_query($koneksi, $query);

   // Cek jika query SQL gagal mengeksekusi struktur tabel
   if (!$result) {
      // Jangan biarkan server melempar 500, kirim error lognya ke React Console
      echo json_encode([
         "status" => "error",
         "message" => mysqli_error($koneksi),
         "query_debug" => $query
      ]);
      exit();
   }

   if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_assoc($result)) {
         $data_analitik[] = [
            "tanggal" => $row['tgl_label'],
            "masuk" => (int) $row['total_masuk'],
            "keluar" => (int) $row['total_keluar']
         ];
      }
   }
}

// 4. FALLBACK DATA (Gua ganti 0 semua agar lu tahu kalau query sukses tapi tabel lu emang lagi kosong)
if (empty($data_analitik)) {
   $data_analitik = [
      ["tanggal" => date('d M'), "masuk" => 0, "keluar" => 0]
   ];
}

// Kirim data murni JSON kembali ke React Dashboard
echo json_encode($data_analitik);
?>