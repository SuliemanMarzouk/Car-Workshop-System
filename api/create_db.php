<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$servername", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "CREATE DATABASE IF NOT EXISTS car_service_db";
    // use exec() because no results are returned
    $conn->exec($sql);
    echo "Database created successfully";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit(1);
}

$conn = null;
?>