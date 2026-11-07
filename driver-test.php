<?php
declare(strict_types=1);

function p10x_driver_data(): array {
    static $data;
    return $data ??= json_decode((string)file_get_contents(__DIR__.'/data/driver-personality-test.json'), true, 512, JSON_THROW_ON_ERROR);
}

function p10x_driver_payload(array $request): array {
    $data = p10x_driver_data();
    $lead = $request['lead'] ?? [];
    $answers = $request['answers'] ?? [];
    if (!is_array($lead) || !is_array($answers)) throw new InvalidArgumentException('Please complete your details and all 25 questions.');
    foreach (['name','phone','carModel','referredBy','referredByOther'] as $field) {
        if (isset($lead[$field]) && !is_string($lead[$field])) throw new InvalidArgumentException('Please check your details.');
    }
    if (isset($request['email']) && !is_string($request['email'])) throw new InvalidArgumentException('Please enter a valid email address.');
    $name = trim((string)($lead['name'] ?? ''));
    $phone = trim((string)($lead['phone'] ?? ''));
    $car = trim((string)($lead['carModel'] ?? ''));
    $referrer = (string)($lead['referredBy'] ?? '');
    $other = trim((string)($lead['referredByOther'] ?? ''));
    $email = trim((string)($request['email'] ?? ''));
    $digits = preg_replace('/[\s\-()+.]/', '', $phone);
    if ($name === '' || strlen($name) > 200) throw new InvalidArgumentException('Please enter your name.');
    if (!preg_match('/^\d{6,16}$/', $digits ?? '')) throw new InvalidArgumentException('Please enter a valid phone number.');
    if ($car === '' || strlen($car) > 200) throw new InvalidArgumentException('Please enter your car make and model.');
    if (!in_array($referrer, $data['referrers'], true) || strlen($other) > 200) throw new InvalidArgumentException('Please select who shared this with you.');
    if ($email !== '' && (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || preg_match('/[\r\n]/', $email))) throw new InvalidArgumentException('Please enter a valid email address.');
    $ppfScore = 0; $tintScore = 0; $security = null; $privacy = null;
    foreach ($data['questions'] as $question) {
        $id = $question['id'];
        if (!array_key_exists($id, $answers)) throw new InvalidArgumentException('Please answer all 25 questions.');
        $value = $answers[$id];
        $multiple = !empty($question['allowMultiple']);
        if (($multiple && (!is_array($value) || $value === [])) || (!$multiple && !is_int($value))) throw new InvalidArgumentException('Please check your answers.');
        $selected = $multiple ? $value : [$value];
        if (count(array_unique($selected, SORT_REGULAR)) !== count($selected)) throw new InvalidArgumentException('Please check your answers.');
        foreach ($selected as $index) {
            if (!is_int($index) || !isset($question['answers'][$index])) throw new InvalidArgumentException('Please check your answers.');
            $answer = $question['answers'][$index];
            if ($id <= 15) $ppfScore += $answer['score']; else $tintScore += $answer['score'];
            if ($id === 23 && isset($answer['meta'])) $security = $answer['meta'];
            if ($id === 24 && isset($answer['meta'])) $privacy = $answer['meta'];
        }
    }
    $celebrity = null;
    foreach ($data['celebrities'] as $candidate) if ($candidate['id'] === ($request['celebrityId'] ?? '')) $celebrity = $candidate;
    if (!$celebrity) throw new InvalidArgumentException('Please complete the personality test again.');
    $ppf = $data['ppfPackages'][$ppfScore >= 38 ? 'full' : ($ppfScore >= 24 ? 'hybrid' : 'ceramic')];
    $tint = $data['tintPackages'][$tintScore >= 24 ? 'high' : ($tintScore >= 14 ? 'medium' : 'standard')];
    // Keep the field names and values used by the original P10X submission workflow.
    return [
        'name'=>$name, 'phone'=>$phone, 'email'=>$email, 'car_model'=>$car,
        'referred_by'=>$referrer === 'Others' && $other !== '' ? "Others ($other)" : $referrer,
        'celebrity_name'=>$celebrity['name'], 'celebrity_category'=>$celebrity['category'],
        'celebrity_nationality'=>$celebrity['nationality'], 'celebrity_traits'=>implode(', ', $celebrity['personalityTraits']),
        'ppf_recommendation'=>$ppf['title'], 'ppf_subtitle'=>$ppf['subtitle'], 'ppf_score'=>$ppfScore,
        'tint_recommendation'=>$tint['title'], 'tint_score'=>$tintScore, 'tint_heat_rejection'=>$tint['heatRejection'],
        'security_addon'=>$security === 'security' ? 'Yes' : 'No', 'max_privacy_tint'=>$privacy === 'dark' ? 'Yes' : 'No',
        'submitted_at'=>gmdate('Y-m-d\TH:i:s').'.000Z'
    ];
}

function p10x_driver_deliver(array $payload, ?callable $transport = null): bool {
    $destination = 'https://hooks.zapier.com/hooks/catch/26822386/ux78hze/';
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    if ($transport) return $transport($destination, $body) === true;
    $context = stream_context_create(['http'=>[
        'method'=>'POST', 'header'=>"Content-Type: application/json\r\nAccept: application/json\r\n",
        'content'=>$body, 'timeout'=>12, 'ignore_errors'=>true, 'follow_location'=>0
    ]]);
    $response = @file_get_contents($destination, false, $context);
    $status = 0;
    foreach ($http_response_header ?? [] as $header) if (preg_match('/^HTTP\/\S+\s+(\d{3})/', $header, $match)) $status = (int)$match[1];
    return $response !== false && $status >= 200 && $status < 300;
}

function p10x_driver_handle(): never {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    $respond = static function(int $status, array $body): never {http_response_code($status); echo json_encode($body); exit;};
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') $respond(405, ['ok'=>false,'message'=>'Method not allowed.']);
    $origin = parse_url($_SERVER['HTTP_ORIGIN'] ?? '', PHP_URL_HOST);
    $host = explode(':', $_SERVER['HTTP_HOST'] ?? '')[0];
    if ($origin && strcasecmp($origin, $host) !== 0) $respond(403, ['ok'=>false,'message'=>'Please submit from the P10X website.']);
    $raw = file_get_contents('php://input', false, null, 0, 24001);
    if ($raw === false || strlen($raw) > 24000) $respond(413, ['ok'=>false,'message'=>'Please check your submission.']);
    try {
        $request = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
        if (!is_array($request) || !empty($request['website'])) throw new InvalidArgumentException('Please check your submission.');
        if (!is_string($request['requestId'] ?? null)) throw new InvalidArgumentException('Please complete the test again.');
        $id = $request['requestId'];
        if (!preg_match('/^[a-zA-Z0-9-]{16,80}$/', $id)) throw new InvalidArgumentException('Please complete the test again.');
        $payload = p10x_driver_payload($request);
    } catch (Throwable $error) {
        $respond(422, ['ok'=>false,'message'=>$error instanceof InvalidArgumentException ? $error->getMessage() : 'Please check your submission.']);
    }
    // Memoise acknowledged sends. Email updates are distinct from the initial completion.
    $key = hash('sha256', $id.'|'.$payload['email']);
    $lock = @fopen(sys_get_temp_dir().'/p10x-driver-'.$key, 'c+');
    if (!$lock || !flock($lock, LOCK_EX)) $respond(503, ['ok'=>false,'message'=>'Your result is ready, but we could not send your details. Please try again.']);
    $sent = trim(stream_get_contents($lock));
    if ($sent !== '') {fclose($lock); $respond(200, ['ok'=>true]);}
    if (!p10x_driver_deliver($payload)) {fclose($lock); $respond(502, ['ok'=>false,'message'=>'Your result is ready, but we could not send your details. Please try again.']);}
    rewind($lock); ftruncate($lock, 0); fwrite($lock, (string)time()); fclose($lock);
    $respond(200, ['ok'=>true]);
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) p10x_driver_handle();
