<?php
declare(strict_types=1);

function formResponse(int $status, bool $ok, string $message): never
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit();
}

function requireFormPost(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        formResponse(405, false, 'Method not allowed.');
    }
    $origin = parse_url($_SERVER['HTTP_ORIGIN'] ?? '', PHP_URL_HOST);
    $host = explode(':', $_SERVER['HTTP_HOST'] ?? '')[0];
    if ($origin && strcasecmp($origin, $host) !== 0) {
        formResponse(403, false, 'Please submit from the P10X website.');
    }
}

function sendFormMail(
    string $rateKey,
    string $replyTo,
    string $subject,
    string $body,
    string $rateMessage,
): bool {
    $ratePath = sys_get_temp_dir() . '/p10x-' . $rateKey . '-' .
        hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $rate = @fopen($ratePath, 'c+');
    if (!$rate || !flock($rate, LOCK_EX)) {
        formResponse(503, false, 'Please email info@p10x.my.');
    }
    $lastSent = (int) stream_get_contents($rate);
    if (time() - $lastSent < 60) {
        fclose($rate);
        formResponse(429, false, $rateMessage);
    }

    $recipient = getenv('P10X_CONTACT_TO') ?: 'info@p10x.my';
    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        fclose($rate);
        formResponse(503, false, 'Please email info@p10x.my.');
    }
    try {
        $sent = mail($recipient, $subject, $body, [
            'Reply-To' => $replyTo,
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
        if ($sent) {
            rewind($rate);
            ftruncate($rate, 0);
            fwrite($rate, (string) time());
        }
        return $sent;
    } finally {
        fclose($rate);
    }
}
