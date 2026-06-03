<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "koneksi.php";

$data = json_decode(file_get_contents("php://input"));

$username = mysqli_real_escape_string($koneksi, $data->username);
$password = md5($data->password);

$query = mysqli_query(
   $koneksi,
   "SELECT * FROM users
    WHERE username='$username'
    AND password='$password'
    LIMIT 1"
);

if (mysqli_num_rows($query) > 0) {

   $user = mysqli_fetch_assoc($query);

   echo json_encode([
      "success" => true,
      "user" => [
         "id" => $user["id"],
         "nama" => $user["nama"],
         "username" => $user["username"],
         "role" => $user["role"]
      ]
   ]);

} else {

   echo json_encode([
      "success" => false,
      "message" => "Username atau password salah"
   ]);

}