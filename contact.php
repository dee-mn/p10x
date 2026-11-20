<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/form-mail.php';

requireFormPost();
if (!empty($_POST['website'])) {
    formResponse(400, false, 'Unable to send this enquiry.');
}
$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
if (
    !$name ||
    strlen($name) > 200 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !$phone ||
    strlen($phone) > 80 ||
    !$message ||
    strlen($message) > 8000 ||
    preg_match('/[\r\n]/', $email)
) {
    formResponse(422, false, 'Please enter a valid name, email, phone and message.');
}

$sent = sendFormMail(
    'contact',
    $email,
    'P10X website enquiry',
    "Name: $name\nEmail: $email\nPhone: $phone\n\n$message",
    'Please wait a minute before sending another enquiry.',
);
if (!$sent) {
    formResponse(
        503,
        false,
        'Email delivery is unavailable. Please email info@p10x.my.',
    );
}
formResponse(200, true, 'Your enquiry has been sent.');
