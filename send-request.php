<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$name   = trim(strip_tags($input['name']   ?? ''));
$email  = trim(strip_tags($input['email']  ?? ''));
$date   = trim(strip_tags($input['date']   ?? ''));
$reason = trim(strip_tags($input['reason'] ?? ''));

if (!$name || !$email || !$date || !$reason) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Prevent header injection
$name  = str_replace(["\r", "\n"], '', $name);
$email = str_replace(["\r", "\n"], '', $email);
$date  = str_replace(["\r", "\n"], '', $date);

$to      = 'professional@verkade.org';
$subject = "Presence Request from {$name}";

$body =
    "Dear Daan Verkade,\n\n" .
    "I, {$name}, require your presence because \n{$reason}\n\n" .
    "Sincerely,\n{$name}\n\n" .
    "---\n" .
    "Requested date: {$date}\n" .
    "Requester email: {$email}";

$headers = implode("\r\n", [
    'From: noreply@verkade.org',
    "Reply-To: {$email}",
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
]);

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email. Check that PHP mail() is configured on the server.']);
}
