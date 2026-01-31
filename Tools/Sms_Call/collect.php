<?php
// ===== BASIC SECURITY =====
$SECRET_TOKEN = "fuckyou";

// Read raw POST body
$raw = file_get_contents("php://input");
if (!$raw) {
    http_response_code(400);
    exit("No data");
}

// Decode JSON
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    exit("Invalid JSON");
}

// Token check (VERY IMPORTANT)
if (!isset($data["token"]) || $data["token"] !== $SECRET_TOKEN) {
    http_response_code(403);
    exit("Unauthorized");
}

// Add server timestamp
$data["server_time"] = date("Y-m-d H:i:s");

// Store as one-line JSON
file_put_contents(
    "data.log",
    json_encode($data) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

// Success response
echo "OK";
