<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SMS & Call Logs</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        h1 {
            text-align: center;
        }
        .card {
            background: #fff;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .sms { border-left: 5px solid #4CAF50; }
        .call { border-left: 5px solid #2196F3; }
        .time {
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>

<h1>SMS & Call Records</h1>

<?php
$file = "data.log";
if (!file_exists($file)) {
    echo "<p>No data yet</p>";
    exit;
}

$lines = array_reverse(file($file));
foreach ($lines as $line) {
    $d = json_decode($line, true);
    if (!$d) continue;

    $type = $d["type"];
    echo "<div class='card $type'>";

    if ($type === "sms") {
        echo "<b>SMS</b><br>";
        echo "From: " . htmlspecialchars($d["from"]) . "<br>";
        echo "Message: " . nl2br(htmlspecialchars($d["message"])) . "<br>";
    } else if ($type === "call") {
        echo "<b>Call</b><br>";
        echo "Number: " . htmlspecialchars($d["number"]) . "<br>";
        echo "Duration: " . htmlspecialchars($d["duration"]) . " sec<br>";
    }

    echo "<div class='time'>Server Time: "
         . htmlspecialchars($d["server_time"]) .
         "</div>";

    echo "</div>";
}
?>

</body>
</html>
