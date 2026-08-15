<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

register_shutdown_function(function () {
    $error = error_get_last();
    if (!$error) {
        return;
    }
    $fatalTypes = array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR);
    if (!in_array($error['type'], $fatalTypes, true)) {
        return;
    }
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
    }
    echo json_encode(array(
        'success' => false,
        'message' => $error['message'],
        'file' => basename($error['file']),
        'line' => $error['line'],
    ));
});

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'message' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine(),
    ));
    exit;
});

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed = array(
    'https://allday-shopping.com',
    'https://www.allday-shopping.com',
    'http://allday-shopping.com',
    'http://www.allday-shopping.com',
    'http://localhost:3000',
    'http://localhost:5173',
);
if ($origin && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

date_default_timezone_set('Asia/Kolkata');

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('success' => false, 'error' => 'Only POST allowed.'));
    exit;
}

loadEnvFile();

$inputData = $_POST;
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (stripos($contentType, 'application/json') !== false) {
    $json = file_get_contents('php://input');
    $decoded = json_decode($json, true);
    if (is_array($decoded)) {
        $inputData = $decoded;
    }
}

function loadEnvFile()
{
    $candidates = array(
        dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env',
        __DIR__ . DIRECTORY_SEPARATOR . '.env',
        dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . '.env',
    );
    foreach ($candidates as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) {
            return;
        }
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
                continue;
            }
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            $value = trim($value, "\"'");
            if ($key === '') {
                continue;
            }
            if (!isset($_ENV[$key])) {
                $_ENV[$key] = $value;
            }
            if (getenv($key) === false) {
                putenv($key . '=' . $value);
            }
        }
        return;
    }
}

function envVal($key, $default = '')
{
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return (string) $_ENV[$key];
    }
    $fromEnv = getenv($key);
    if ($fromEnv !== false && $fromEnv !== '') {
        return (string) $fromEnv;
    }
    return $default;
}

function v($key, $default = '')
{
    global $inputData;
    if (!isset($inputData[$key])) {
        return $default;
    }
    $val = trim((string) $inputData[$key]);
    return $val !== '' ? $val : $default;
}

function firstFilled($keys)
{
    foreach ($keys as $key) {
        $val = v($key);
        if ($val !== '') {
            return $val;
        }
    }
    return '';
}

function clean($s)
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

function requiredFields($arr)
{
    global $inputData;
    foreach ($arr as $k => $label) {
        if (!isset($inputData[$k]) || trim((string) $inputData[$k]) === '') {
            return $label . ' is required';
        }
    }
    return null;
}

function kvRow($label, $value, $multiline = false)
{
    if ($value === '') {
        $value = '-';
    }
    $body = $multiline ? nl2br(clean($value)) : clean($value);
    return '<p style="margin:0 0 8px;"><strong>' . clean($label) . ':</strong> ' . ($multiline ? '<br>' : '') . $body . '</p>';
}

function findAutoload()
{
    $candidates = array(
        __DIR__ . '/vendor/autoload.php',
        __DIR__ . '/../vendor/autoload.php',
        dirname(__DIR__) . '/vendor/autoload.php',
        dirname(dirname(__DIR__)) . '/vendor/autoload.php',
    );
    foreach ($candidates as $path) {
        if (is_file($path)) {
            return $path;
        }
    }
    return null;
}

$formType = v('formType');
$allowedTypes = array('contact', 'newsletter', 'quote');
if (!in_array($formType, $allowedTypes, true)) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'error' => 'Invalid formType.'));
    exit;
}

if ($formType === 'contact') {
    $msg = requiredFields(array('name' => 'Name', 'email' => 'Email'));
} elseif ($formType === 'newsletter') {
    $msg = requiredFields(array('email' => 'Email'));
} else {
    $msg = requiredFields(array(
        'billing_first_name' => 'Billing First Name',
        'billing_last_name' => 'Billing Last Name',
        'billing_email' => 'Billing Email',
        'billing_phone' => 'Billing Phone',
        'billing_address' => 'Billing Address',
        'billing_town' => 'Billing Town',
        'cart_items' => 'Cart Items (JSON)',
        'cart_total' => 'Cart Total',
        'order_total' => 'Order Total',
    ));
}
if ($msg) {
    http_response_code(422);
    echo json_encode(array('success' => false, 'error' => $msg));
    exit;
}

$email = firstFilled(array('email', 'billing_email', 'shipping_email'));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(array('success' => false, 'error' => 'Invalid email.'));
    exit;
}

$name = firstFilled(array('name', 'billing_first_name', 'firstName'));
if ($formType === 'quote') {
    $name = trim(v('billing_first_name') . ' ' . v('billing_last_name'));
}

$brandName = 'All Day Shopping';
$tagline = "India's trusted store for electronics, books, stationery, and garments.";
$brandColor = '#9333ea';
$border = '#e5e7eb';
$toEmail = 'info@allday-shopping.com';

if ($formType === 'contact') {
    $subject = 'New Contact Inquiry - All Day Shopping - ' . $name;
} elseif ($formType === 'newsletter') {
    $subject = 'New Newsletter Signup - All Day Shopping - ' . $email;
} elseif ($formType === 'quote') {
    $subject = 'New Quote Request - All Day Shopping - ' . $name;
} else {
    $subject = 'Form Submission - All Day Shopping';
}

$mainContent = '';
$alt = $subject . "\n\n";

if ($formType === 'contact') {
    $fullName = v('name', trim(v('firstName') . ' ' . v('lastName')));
    $mainContent =
        '<tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ' . $border . ';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">Contact Details</td></tr>
          <tr><td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">'
        . kvRow('First Name', v('firstName'))
        . kvRow('Last Name', v('lastName'))
        . kvRow('Full Name', $fullName)
        . kvRow('Email', v('email'))
        . kvRow('Phone', v('phone'))
        . kvRow('Subject', v('subject'))
        . kvRow('Message', v('message'), true)
        . '</td></tr></table></td></tr>';
    $alt .= "First Name: " . v('firstName') . "\nLast Name: " . v('lastName') . "\nName: " . $fullName . "\nEmail: " . v('email') . "\nPhone: " . v('phone') . "\nSubject: " . v('subject') . "\nMessage: " . v('message') . "\n";
} elseif ($formType === 'newsletter') {
    $mainContent =
        '<tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ' . $border . ';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">Newsletter Subscription</td></tr>
          <tr><td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">'
        . kvRow('Email', $email)
        . '</td></tr></table></td></tr>';
    $alt .= "Email: " . $email . "\n";
} else {
    $cartHtml = '';
    $cart = json_decode(v('cart_items'), true);
    if (is_array($cart) && count($cart)) {
        $cartHtml .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;">
          <tr style="background:#f3f4f6;">
            <th align="left" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">Item</th>
            <th align="center" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">Qty</th>
            <th align="right" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">Price</th>
          </tr>';
        foreach ($cart as $item) {
            $itemName = isset($item['name']) ? (string) $item['name'] : '';
            $itemQty = isset($item['quantity']) ? (string) $item['quantity'] : '';
            $itemPrice = isset($item['price']) ? (string) $item['price'] : '';
            $cartHtml .= '<tr>
              <td align="left" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">' . clean($itemName) . '</td>
              <td align="center" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">' . clean($itemQty) . '</td>
              <td align="right" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">' . clean($itemPrice) . '</td>
            </tr>';
            $alt .= $itemName . ' x ' . $itemQty . ' - ' . $itemPrice . "\n";
        }
        $cartHtml .= '</table>';
    }

    $billingTownLine = v('billing_address') . ', ' . v('billing_town');
    if (v('billing_state')) {
        $billingTownLine .= ', ' . v('billing_state');
    }
    if (firstFilled(array('postcode', 'billing_postcode')) !== '') {
        $billingTownLine .= ' - ' . firstFilled(array('postcode', 'billing_postcode'));
    }

    $billingInfo = '<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ' . $border . ';border-radius:4px;">
        <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">Billing Info</td></tr>
        <tr><td style="padding:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">
          <p><strong>' . clean(v('billing_first_name') . ' ' . v('billing_last_name')) . '</strong></p>
          <p>' . clean(v('billing_email')) . '</p>
          <p>Phone: ' . clean(v('billing_phone')) . '</p>
          <p>' . clean($billingTownLine) . '</p>';
    if (v('notes')) {
        $billingInfo .= '<p><strong>Notes:</strong> ' . nl2br(clean(v('notes'))) . '</p>';
    }
    $billingInfo .= '</td></tr></table>';

    $mainContent =
        '<tr><td style="padding:0 24px 24px;">' . $billingInfo . '</td></tr>
        <tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ' . $border . ';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">Order Summary</td></tr>
          <tr><td style="padding:10px;">' . $cartHtml . '
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-collapse:collapse;">
              <tr><td align="right" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">CART SUBTOTAL:</td><td align="right" style="padding:6px 0;">' . clean(v('cart_total')) . '</td></tr>
              <tr><td align="right" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">SHIPPING AND HANDLING:</td><td align="right" style="padding:6px 0;">FREE SHIPPING</td></tr>
              <tr><td align="right" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">ORDER TOTAL:</td><td align="right" style="padding:6px 0;">' . clean(v('order_total')) . '</td></tr>
            </table>
          </td></tr>
        </table></td></tr>';

    $alt .= "Billing: " . v('billing_first_name') . " " . v('billing_last_name') . "\nEmail: " . v('billing_email') . "\nPhone: " . v('billing_phone') . "\nAddress: " . $billingTownLine . "\n";
    if (v('notes')) {
        $alt .= "Notes: " . v('notes') . "\n";
    }
    $alt .= "Cart total: " . v('cart_total') . "\nOrder total: " . v('order_total') . "\n";
}

$html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' . clean($subject) . '</title></head>
<body style="margin:0;padding:0;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:30px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:6px;">
        <tr><td align="center" style="padding:30px 10px 20px;">
          <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;color:' . $brandColor . ';">' . clean($brandName) . '</h1>
          <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">' . clean($tagline) . '</p>
        </td></tr>
        <tr><td style="height:1px;background:#e5e7eb;"></td></tr>
        <tr><td align="center" style="padding:20px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;color:' . $brandColor . ';">' . clean($subject) . '</p>
          <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">Received at ' . date('Y-m-d H:i:s') . ' (IST)</p>
        </td></tr>
        ' . $mainContent . '
        <tr><td align="center" style="padding:14px 20px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">
          This email was generated from the <strong>' . clean($brandName) . '</strong> website and sent to ' . clean($toEmail) . '.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>';

$smtpHost = envVal('SMTP_HOST');
$smtpUser = envVal('SMTP_USER');
$smtpPass = envVal('SMTP_PASS');
$smtpPort = (int) envVal('SMTP_PORT', '465');
$smtpSecure = envVal('SMTP_SECURE', 'smtps');
$fromEmail = $smtpUser !== '' ? $smtpUser : $toEmail;
$fromName = $brandName;
$replyName = $name !== '' ? $name : $email;

$sent = false;
$sendError = '';

$autoload = findAutoload();
if ($autoload && $smtpHost !== '') {
    try {
        require $autoload;
        if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
            $mail->Port = $smtpPort > 0 ? $smtpPort : 465;
            if ($smtpSecure === 'smtps' || $smtpPort === 465) {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            }
            $mail->CharSet = 'UTF-8';
            $mail->setFrom($fromEmail, $fromName);
            $mail->addAddress($toEmail, $brandName);
            $mail->addReplyTo($email, $replyName);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $html;
            $mail->AltBody = $alt;
            $mail->send();
            $sent = true;

            try {
                $mail->clearAllRecipients();
                $mail->clearReplyTos();
                $mail->setFrom($fromEmail, $fromName);
                $mail->addAddress($email, $replyName);
                $mail->Subject = 'Thanks for contacting ' . $brandName;
                $mail->Body = '<p>Hi ' . clean($replyName) . ',</p><p>Thanks for reaching out to <strong>' . clean($brandName) . '</strong>. We have received your details and will contact you shortly.</p><p>Regards,<br><strong>' . clean($brandName) . ' Team</strong></p>';
                $mail->AltBody = 'Hi ' . $replyName . ', thanks for contacting ' . $brandName . '. We will get back to you shortly.';
                $mail->send();
            } catch (Exception $ignored) {
            }
        }
    } catch (Exception $e) {
        $sendError = $e->getMessage();
    } catch (Throwable $e) {
        $sendError = $e->getMessage();
    }
}

if (!$sent) {
    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $fromName . ' <' . $fromEmail . '>';
    $headers[] = 'Reply-To: ' . $replyName . ' <' . $email . '>';
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    $sent = @mail($toEmail, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, implode("\r\n", $headers));
    if (!$sent && $sendError === '') {
        $sendError = 'Unable to send email. Configure SMTP_HOST, SMTP_USER, SMTP_PASS in .env or enable PHP mail().';
    }
}

if (!$sent) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'error' => 'Failed to send email.',
        'message' => $sendError,
    ));
    exit;
}

echo json_encode(array('success' => true, 'message' => 'Message sent successfully.'));
