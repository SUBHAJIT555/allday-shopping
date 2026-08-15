<?php
declare(strict_types=1);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    error_log("PHP Error [$errno]: $errstr in $errfile on line $errline");
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred. Please try again later.']);
    exit;
});

set_exception_handler(function ($e) {
    error_log("Uncaught Exception: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred. Please try again later.']);
    exit;
});

// --- CORS ---
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'https://allday-shopping.com',
    'https://www.allday-shopping.com',
    'http://localhost:3000',
];
if ($origin && in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

date_default_timezone_set('Asia/Kolkata');
mb_internal_encoding('UTF-8');
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

// --- Parse request body (FormData or JSON) ---
$inputData = [];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $json = file_get_contents('php://input');
    $inputData = json_decode($json, true) ?? [];
} else {
    $inputData = $_POST;
}

function v(string $key, string $default = ''): string {
    global $inputData;
    if (!isset($inputData[$key])) return $default;
    $val = trim((string)$inputData[$key]);
    return $val !== '' ? $val : $default;
}

function firstFilled(array $keys): string {
    foreach ($keys as $key) {
        $val = v($key);
        if ($val !== '') return $val;
    }
    return '';
}

function clean(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function required(array $arr): ?string {
    global $inputData;
    foreach ($arr as $k => $label) {
        if (!isset($inputData[$k]) || trim((string)$inputData[$k]) === '') {
            return "$label is required";
        }
    }
    return null;
}

function kvRow(string $label, string $value, bool $multiline = false): string {
    if ($value === '') $value = '—';
    $body = $multiline ? nl2br(clean($value)) : clean($value);
    return '<p style="margin:0 0 8px;"><strong>'.clean($label).':</strong> '.($multiline ? '<br>' : '').$body.'</p>';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST allowed.']);
    exit;
}

/**
 * Website forms that POST here:
 * 1. contact    — /contact
 * 2. newsletter — homepage newsletter
 * 3. quote      — /checkout request for quote
 *
 * UI-only forms (not emailed): header search, shop filters, cart coupon.
 */
$formType = v('formType');
$allowedTypes = ['contact', 'newsletter', 'quote'];
if (!in_array($formType, $allowedTypes, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid formType.']);
    exit;
}

if ($formType === 'contact') {
    if ($msg = required(['name' => 'Name', 'email' => 'Email'])) {
        http_response_code(422);
        echo json_encode(['error' => $msg]);
        exit;
    }
} elseif ($formType === 'newsletter') {
    if ($msg = required(['email' => 'Email'])) {
        http_response_code(422);
        echo json_encode(['error' => $msg]);
        exit;
    }
} elseif ($formType === 'quote') {
    if ($msg = required([
        'billing_first_name' => 'Billing First Name',
        'billing_last_name'  => 'Billing Last Name',
        'billing_email'      => 'Billing Email',
        'billing_phone'      => 'Billing Phone',
        'billing_address'    => 'Billing Address',
        'billing_town'       => 'Billing Town',
        'cart_items'         => 'Cart Items (JSON)',
        'cart_total'         => 'Cart Total',
        'order_total'        => 'Order Total',
    ])) {
        http_response_code(422);
        echo json_encode(['error' => $msg]);
        exit;
    }
}

$email = firstFilled(['email', 'billing_email', 'shipping_email']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid email.']);
    exit;
}

$smtpHost   = $_ENV['SMTP_HOST'];
$smtpUser   = $_ENV['SMTP_USER'];
$smtpPass   = $_ENV['SMTP_PASS'];
$smtpPort   = $_ENV['SMTP_PORT'];
$smtpSecure = $_ENV['SMTP_SECURE'];

$toAddresses = [['info@allday-shopping.com', 'All Day Shopping']];
$fromEmail   = $smtpUser;
$fromName    = 'All Day Shopping';

$brandName  = 'All Day Shopping';
$tagline    = "India's trusted store for electronics, books, stationery, and garments.";
$brandColor = '#9333ea';
$border     = '#e5e7eb';

$replyName = firstFilled(['name', 'billing_first_name', 'firstName']);
if ($replyName === '') $replyName = $email;

switch ($formType) {
    case 'contact':
        $subject = 'New Contact Inquiry - ' . v('name');
        break;
    case 'newsletter':
        $subject = 'New Newsletter Signup - ' . $email;
        break;
    case 'quote':
        $subject = 'New Quote Request - ' . v('billing_first_name') . ' ' . v('billing_last_name');
        break;
    default:
        $subject = 'Form Submission';
        break;
}

$mainContent = '';
$alt = strip_tags($subject) . "\n\n";

if ($formType === 'contact') {
    $fullName = v('name', trim(v('firstName') . ' ' . v('lastName')));
    $mainContent = '
    <tr>
      <td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid '.$border.';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">Contact Details</td></tr>
          <tr><td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">
            '.kvRow('First Name', v('firstName')).'
            '.kvRow('Last Name', v('lastName')).'
            '.kvRow('Full Name', $fullName).'
            '.kvRow('Email', v('email')).'
            '.kvRow('Phone', v('phone')).'
            '.kvRow('Subject', v('subject')).'
            '.kvRow('Message', v('message'), true).'
          </td></tr>
        </table>
      </td>
    </tr>';
    $alt .= "First Name: ".v('firstName')."\n";
    $alt .= "Last Name: ".v('lastName')."\n";
    $alt .= "Name: ".$fullName."\n";
    $alt .= "Email: ".v('email')."\n";
    $alt .= "Phone: ".v('phone')."\n";
    $alt .= "Subject: ".v('subject')."\n";
    $alt .= "Message: ".v('message')."\n";
}

elseif ($formType === 'newsletter') {
    $mainContent = '
    <tr>
      <td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid '.$border.';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">Newsletter Subscription</td></tr>
          <tr><td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">
            '.kvRow('Email', $email).'
          </td></tr>
        </table>
      </td>
    </tr>';
    $alt .= "Email: ".$email."\n";
}

elseif ($formType === 'quote') {
    $cartHtml = '';
    $cart = json_decode(v('cart_items'), true);
    if (is_array($cart) && count($cart)) {
        $cartHtml .= '
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;">
          <tr style="background:#f3f4f6;">
            <th align="left" style="padding:8px;border:1px solid '.$border.';font-family:Arial,Helvetica,sans-serif;">Item</th>
            <th align="center" style="padding:8px;border:1px solid '.$border.';font-family:Arial,Helvetica,sans-serif;">Qty</th>
            <th align="right" style="padding:8px;border:1px solid '.$border.';font-family:Arial,Helvetica,sans-serif;">Price</th>
          </tr>';
        foreach ($cart as $item) {
            $itemName  = isset($item['name']) ? (string)$item['name'] : '';
            $itemQty   = isset($item['quantity']) ? (string)$item['quantity'] : '';
            $itemPrice = isset($item['price']) ? (string)$item['price'] : '';
            $cartHtml .= '
            <tr>
              <td align="left" style="padding:8px;border:1px solid '.$border.';font-family:Arial,Helvetica,sans-serif;">'.clean($itemName).'</td>
              <td align="center" style="padding:8px;border:1px solid '.$border.';font-family:Arial,Helvetica,sans-serif;">'.clean($itemQty).'</td>
              <td align="right" style="padding:8px;border:1px solid '.$border.';font-family:Arial,Helvetica,sans-serif;">'.clean($itemPrice).'</td>
            </tr>';
            $alt .= $itemName.' x '.$itemQty.' — '.$itemPrice."\n";
        }
        $cartHtml .= '</table>';
    }

    $billingTownLine = v('billing_address').', '.v('billing_town');
    if (v('billing_state')) $billingTownLine .= ', '.v('billing_state');
    if (v('postcode') || v('billing_postcode')) {
        $billingTownLine .= ' - '.firstFilled(['postcode', 'billing_postcode']);
    }

    $billingInfo = '
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid '.$border.';border-radius:4px;">
        <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">Billing Info</td></tr>
        <tr><td style="padding:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">
          <p><strong>'.clean(v('billing_first_name').' '.v('billing_last_name')).'</strong></p>
          <p>'.clean(v('billing_email')).'</p>
          <p>Phone: '.clean(v('billing_phone')).'</p>
          <p>'.clean($billingTownLine).'</p>';
    if (v('notes')) {
        $billingInfo .= '<p><strong>Notes:</strong> '.nl2br(clean(v('notes'))).'</p>';
    }
    $billingInfo .= '
        </td></tr>
      </table>';

    $shippingInfo = '';
    if (v('shipping_first_name') || v('shipping_address')) {
        $shippingInfo = '
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid '.$border.';border-radius:4px;">
            <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">Shipping Info</td></tr>
            <tr><td style="padding:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">';
        if (v('shipping_first_name')) {
            $shippingInfo .= '<p><strong>'.clean(v('shipping_first_name').' '.v('shipping_last_name')).'</strong></p>';
        }
        if (v('shipping_email')) {
            $shippingInfo .= '<p>'.clean(v('shipping_email')).'</p>';
        }
        if (v('shipping_phone')) {
            $shippingInfo .= '<p>Phone: '.clean(v('shipping_phone')).'</p>';
        }
        if (v('shipping_address')) {
            $shippingInfo .= '<p>'.clean(v('shipping_address'));
            if (v('shipping_town')) $shippingInfo .= ', '.clean(v('shipping_town'));
            if (v('shipping_state')) $shippingInfo .= ', '.clean(v('shipping_state'));
            $shippingInfo .= '</p>';
        }
        $shippingInfo .= '
            </td></tr>
          </table>';
    }

    $mainContent = '
    <tr>
      <td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td class="stack-column" valign="top" width="50%" style="padding:10px;">'.$billingInfo.'</td>';
    if ($shippingInfo) {
        $mainContent .= '<td class="stack-column" valign="top" width="50%" style="padding:10px;">'.$shippingInfo.'</td>';
    }
    $mainContent .= '
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid '.$border.';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">Order Summary</td></tr>
          <tr><td style="padding:10px;">'.$cartHtml.'
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-collapse:collapse;">
              <tr><td align="right" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">CART SUBTOTAL:</td><td align="right" style="padding:6px 0;">'.clean(v('cart_total')).'</td></tr>
              <tr><td align="right" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">SHIPPING AND HANDLING:</td><td align="right" style="padding:6px 0;">FREE SHIPPING</td></tr>
              <tr><td align="right" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:'.$brandColor.';">ORDER TOTAL:</td><td align="right" style="padding:6px 0;">'.clean(v('order_total')).'</td></tr>
            </table>
          </td></tr>
        </table>
      </td>
    </tr>';

    $alt .= "Billing: ".v('billing_first_name')." ".v('billing_last_name')."\n";
    $alt .= "Email: ".v('billing_email')."\n";
    $alt .= "Phone: ".v('billing_phone')."\n";
    $alt .= "Address: ".$billingTownLine."\n";
    if (v('notes')) $alt .= "Notes: ".v('notes')."\n";
    $alt .= "Cart total: ".v('cart_total')."\n";
    $alt .= "Order total: ".v('order_total')."\n";
}

ob_start(); ?>
<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title><?= clean($subject) ?></title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      <o:AllowPNG/>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style>
    body { margin:0; padding:0; background:#f9fafb; -webkit-text-size-adjust:none; text-size-adjust:none; }
    table, td { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { border:0; display:block; line-height:0; }
    @media (max-width:600px){ .stack-column { display:block!important; width:100%!important; } }
  </style>
</head>
<body style="margin:0;padding:0;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
    <tr>
      <td align="center" style="padding:30px 10px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:600px;max-width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:30px 10px 20px;">
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;color:<?= $brandColor ?>;font-weight:700;"><?= clean($brandName) ?></h1>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;"><?= clean($tagline) ?></p>
            </td>
          </tr>
          <tr><td style="height:1px;background:#e5e7eb;"></td></tr>
          <tr>
            <td align="center" style="padding:20px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;color:<?= $brandColor ?>;"><?= clean($subject) ?></p>
              <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">Received at <?= date('Y-m-d H:i:s') ?> (IST)</p>
            </td>
          </tr>
          <?= $mainContent ?>
          <tr>
            <td align="center" style="padding:14px 20px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">
              This email was generated from the <strong><?= clean($brandName) ?></strong> website and sent to info@allday-shopping.com.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
<?php
$html = ob_get_clean();

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->SMTPSecure = $smtpSecure === 'smtps' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->setFrom($fromEmail, $fromName);
    foreach ($toAddresses as [$addr, $nm]) $mail->addAddress($addr, $nm);
    $mail->addReplyTo($email, $replyName);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $html;
    $mail->AltBody = $alt;
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Message sent.']);
} catch (Exception $e) {
    error_log('Mailer Error: '.$mail->ErrorInfo);
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email.']);
}
