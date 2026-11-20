<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/form-mail.php';

requireFormPost();
$name = trim((string) ($_POST['author'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$comment = trim((string) ($_POST['comment'] ?? ''));
$page = trim((string) ($_POST['page'] ?? ''));
if (
    !$name ||
    strlen($name) > 200 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    preg_match('/[\r\n]/', $email) ||
    !$comment ||
    strlen($comment) > 8000 ||
    !preg_match('~^/(?:insights/)?[a-z0-9-]+/$~D', $page)
) {
    formResponse(
        422,
        false,
        'Please enter your name, a valid email address and comment.',
    );
}

$sent = sendFormMail(
    'comment',
    $email,
    'P10X article comment for review',
    "Page: $page\nName: $name\nEmail: $email\n\n$comment",
    'Please wait a minute before sending another comment.',
);
if (!$sent) {
    formResponse(503, false, 'Unable to send. Please email info@p10x.my.');
}
formResponse(200, true, 'Your comment has been sent for review.');
