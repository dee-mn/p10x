<?php
declare(strict_types=1);
// Standalone PHP handler for Hostinger / Plesk. Requires working server mail.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function respond(int $status, bool $ok, string $message): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, false, 'Method not allowed.');
$origin = parse_url($_SERVER['HTTP_ORIGIN'] ?? '', PHP_URL_HOST);
$host = explode(':', $_SERVER['HTTP_HOST'] ?? '')[0];
if ($origin && strcasecmp($origin, $host) !== 0) respond(403, false, 'Please submit from the P10X website.');
if (!empty($_POST['website'])) respond(400, false, 'Unable to send this enquiry.');
$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
if (!$name || strlen($name)>200 || !filter_var($email,FILTER_VALIDATE_EMAIL) || !$phone || strlen($phone)>80 || !$message || strlen($message)>8000 || preg_match('/[\r\n]/', $email)) respond(422, false, 'Please enter a valid name, email, phone and message.');
$ratePath = sys_get_temp_dir().'/p10x-contact-'.hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rate = @fopen($ratePath, 'c+');
if (!$rate || !flock($rate, LOCK_EX)) respond(503, false, 'Please email info@p10x.my.');
$last = (int)stream_get_contents($rate);
if (time()-$last < 60) {fclose($rate);respond(429,false,'Please wait a minute before sending another enquiry.');}
$recipient = getenv('P10X_CONTACT_TO') ?: 'info@p10x.my';
if (!filter_var($recipient,FILTER_VALIDATE_EMAIL)) {fclose($rate);respond(503,false,'Please email info@p10x.my.');}
$body = "Name: $name\nEmail: $email\nPhone: $phone\n\n$message";
$sent = mail($recipient, 'P10X website enquiry', $body, ['Reply-To'=>$email, 'Content-Type'=>'text/plain; charset=UTF-8']);
if ($sent) {rewind($rate);ftruncate($rate,0);fwrite($rate,(string)time());}
fclose($rate);
if (!$sent) respond(503,false,'Email delivery is unavailable. Please email info@p10x.my.');
respond(200,true,'Your enquiry has been sent.');

