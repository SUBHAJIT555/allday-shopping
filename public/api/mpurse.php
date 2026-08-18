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
        'error' => 'Server error while processing payment.',
    ));
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

loadEnvFiles();

$inputData = array();
$rawInput = file_get_contents('php://input');
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (stripos($contentType, 'application/json') !== false && is_string($rawInput) && $rawInput !== '') {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $inputData = $decoded;
    }
} else {
    $inputData = $_POST;
}

if (!function_exists('openssl_encrypt')) {
    fail(500, 'PHP OpenSSL is required for payment encryption. Use C:/xampp/php/php.exe (yarn php:api).');
}

$action = v('action', 'create_session');
if ($action === 'create_session') {
    startCheckoutPayment();
} elseif ($action === 'status' || $action === 'confirm') {
    confirmPaymentStatus();
} else {
    http_response_code(400);
    echo json_encode(array('success' => false, 'error' => 'Invalid action.'));
}

function loadEnvFiles()
{
    $candidates = array(
        __DIR__ . DIRECTORY_SEPARATOR . '.env',
        __DIR__ . DIRECTORY_SEPARATOR . 'mpurse.env',
        dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env',
        dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . '.env',
        dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . 'mpurse.env',
    );
    foreach ($candidates as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) {
            continue;
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
            if (!isset($_ENV[$key]) || $_ENV[$key] === '') {
                $_ENV[$key] = $value;
            }
            if (getenv($key) === false || getenv($key) === '') {
                putenv($key . '=' . $value);
            }
        }
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
    if (is_array($inputData[$key])) {
        return $default;
    }
    $val = trim((string) $inputData[$key]);
    return $val !== '' ? $val : $default;
}

function fail($code, $error, $extra = array())
{
    http_response_code($code);
    echo json_encode(array_merge(array('success' => false, 'error' => $error), $extra));
    exit;
}

function ok($payload)
{
    echo json_encode(array_merge(array('success' => true), $payload));
    exit;
}

function clean($s)
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

function dataDir()
{
    $dir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
    if (!is_dir($dir)) {
        mkdir($dir, 0700, true);
    }
    return $dir;
}

function orderPath($orderId)
{
    return dataDir() . DIRECTORY_SEPARATOR . preg_replace('/[^A-Za-z0-9_-]/', '', $orderId) . '.json';
}

function saveOrder($order)
{
    $path = orderPath($order['order_id']);
    $json = json_encode($order, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $ok = file_put_contents($path, $json, LOCK_EX);
    if ($ok === false) {
        fail(500, 'Unable to store order details.');
    }
}

function loadOrder($orderId)
{
    $path = orderPath($orderId);
    if (!is_file($path)) {
        return null;
    }
    $raw = file_get_contents($path);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : null;
}

function pruneOldOrders()
{
    $dir = dataDir();
    $files = glob($dir . DIRECTORY_SEPARATOR . '*.json');
    if (!is_array($files)) {
        return;
    }
    $cutoff = time() - (14 * 24 * 60 * 60);
    foreach ($files as $file) {
        if (is_file($file) && filemtime($file) < $cutoff) {
            @unlink($file);
        }
    }
}

function aesEncrypt($plainText, $base64Key)
{
    $key = base64_decode($base64Key, true);
    if ($key === false || strlen($key) !== 32) {
        fail(500, 'Payment encryption is not configured correctly.');
    }
    $iv = random_bytes(16);
    $cipher = openssl_encrypt($plainText, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
    if ($cipher === false) {
        fail(500, 'Unable to encrypt payment request.');
    }
    return base64_encode($iv . $cipher);
}

function aesDecrypt($encrypted, $base64Key)
{
    $key = base64_decode($base64Key, true);
    if ($key === false || strlen($key) !== 32) {
        return '';
    }
    $raw = base64_decode($encrypted, true);
    if ($raw === false || strlen($raw) < 17) {
        return '';
    }
    $iv = substr($raw, 0, 16);
    $cipher = substr($raw, 16);
    $plain = openssl_decrypt($cipher, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
    return is_string($plain) ? trim($plain) : '';
}

function mpurseKeys()
{
    $passKey = envVal('MPURSE_PASS_KEY');
    $clientId = envVal('MPURSE_CLIENT_ID');
    $clientSecret = envVal('MPURSE_CLIENT_SECRET');
    $aesKey = envVal('MPURSE_AES_KEY');
    if ($passKey === '' || $clientId === '' || $clientSecret === '' || $aesKey === '') {
        fail(500, 'Payment gateway is not configured.');
    }
    return array(
        'pass_key' => $passKey,
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
        'aes_key' => $aesKey,
        'mid' => envVal('MPURSE_MID'),
    );
}

function headerSecrets($keys)
{
    $payload = json_encode(array(
        'client_id' => $keys['client_id'],
        'client_secret' => $keys['client_secret'],
        'epoch' => sprintf('%.0f', microtime(true) * 1000),
    ), JSON_UNESCAPED_SLASHES);
    return aesEncrypt($payload, $keys['aes_key']);
}

function siteUrl()
{
    return rtrim(envVal('SITE_URL', 'https://allday-shopping.com'), '/');
}

function paymentMode()
{
    return 'web';
}

function hostedCheckoutUrl($session)
{
    $token = isset($session['session_token']) ? (string) $session['session_token'] : '';
    $links = isset($session['payment_links']) && is_array($session['payment_links']) ? $session['payment_links'] : array();
    $mode = paymentMode();
    $url = '';
    if (isset($links[$mode]) && is_string($links[$mode]) && $links[$mode] !== '') {
        $url = $links[$mode];
    } elseif (isset($links['web']) && is_string($links['web'])) {
        $url = $links['web'];
    }
    if ($url === '' && $token !== '') {
        $url = 'https://secure-sdk.mpurse.io/?id=' . rawurlencode($token);
    }
    return is_string($url) ? $url : '';
}

function alphaName($value, $fallback)
{
    $clean = preg_replace('/[^A-Za-z]/', '', (string) $value);
    return $clean !== '' ? substr($clean, 0, 64) : $fallback;
}

function normalizePhone($value)
{
    $digits = preg_replace('/\D+/', '', (string) $value);
    if (strlen($digits) === 12 && strpos($digits, '91') === 0) {
        $digits = substr($digits, 2);
    }
    if (strlen($digits) === 11 && strpos($digits, '0') === 0) {
        $digits = substr($digits, 1);
    }
    return $digits;
}

function parseCart()
{
    global $inputData;
    $cart = array();
    if (isset($inputData['cart_items'])) {
        if (is_array($inputData['cart_items'])) {
            $cart = $inputData['cart_items'];
        } else {
            $decoded = json_decode((string) $inputData['cart_items'], true);
            if (is_array($decoded)) {
                $cart = $decoded;
            }
        }
    }
    $items = array();
    $total = 0.0;
    foreach ($cart as $row) {
        if (!is_array($row)) {
            continue;
        }
        $name = isset($row['name']) ? trim((string) $row['name']) : '';
        $qty = isset($row['quantity']) ? (int) $row['quantity'] : 0;
        $price = isset($row['price']) ? (float) $row['price'] : 0.0;
        if ($name === '' || $qty < 1 || $qty > 99 || $price <= 0) {
            fail(422, 'Cart items are invalid.');
        }
        $line = round($price * $qty, 2);
        $total += $line;
        $items[] = array(
            'name' => substr($name, 0, 180),
            'quantity' => $qty,
            'price' => number_format($price, 2, '.', ''),
        );
    }
    if (count($items) === 0) {
        fail(422, 'Your cart is empty.');
    }
    $total = round($total, 2);
    if ($total < 1 || $total > 500000) {
        fail(422, 'Order amount is not valid.');
    }
    return array($items, $total);
}

function curlJson($method, $url, $headers = array(), $body = null)
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        $opts = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 15,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CUSTOMREQUEST => $method,
        );
        if ($body !== null) {
            $opts[CURLOPT_POSTFIELDS] = $body;
        }
        curl_setopt_array($ch, $opts);
        $response = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        if ($response === false) {
            fail(502, 'Unable to reach the payment gateway.', array('message' => $curlError));
        }
        $decoded = json_decode((string) $response, true);
        return array($httpCode, is_array($decoded) ? $decoded : array(), (string) $response);
    }

    $headerStr = implode("\r\n", $headers);
    $context = stream_context_create(array(
        'http' => array(
            'method' => $method,
            'header' => $headerStr,
            'content' => $body !== null ? $body : '',
            'timeout' => 30,
            'ignore_errors' => true,
        ),
    ));
    $response = @file_get_contents($url, false, $context);
    $httpCode = 0;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $line) {
            if (preg_match('/HTTP\/\S+\s+(\d+)/', $line, $m)) {
                $httpCode = (int) $m[1];
            }
        }
    }
    if ($response === false) {
        fail(502, 'Unable to reach the payment gateway.');
    }
    $decoded = json_decode((string) $response, true);
    return array($httpCode, is_array($decoded) ? $decoded : array(), (string) $response);
}

function decodeGatewayBody($decoded, $aesKey)
{
    if (isset($decoded['ResponseData']) && is_string($decoded['ResponseData'])) {
        $plain = aesDecrypt($decoded['ResponseData'], $aesKey);
        $end = max(strrpos($plain, '}'), strrpos($plain, ']'));
        if ($end !== false) {
            $plain = substr($plain, 0, $end + 1);
        }
        $parsed = json_decode($plain, true);
        if (is_array($parsed)) {
            return $parsed;
        }
    }
    return is_array($decoded) ? $decoded : array();
}

function collectCheckout()
{
    $firstName = v('billing_first_name', v('firstName'));
    $lastName = v('billing_last_name', v('lastName'));
    $email = v('billing_email', v('email'));
    $phone = normalizePhone(v('billing_phone', v('phone')));
    $address = v('billing_address', v('address'));
    $town = v('billing_town', v('town'));
    $state = v('billing_state', v('state'));
    $postcode = v('billing_postcode', v('postcode'));
    $notes = v('notes');

    if ($firstName === '' || $lastName === '') {
        fail(422, 'First name and last name are required.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail(422, 'Enter a valid email address.');
    }
    if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
        fail(422, 'Enter a valid 10-digit Indian mobile number.');
    }
    if ($address === '' || $town === '') {
        fail(422, 'Street address and town are required.');
    }

    list($items, $total) = parseCart();
    $amount = number_format($total, 2, '.', '');
    $orderId = 'ADS' . strtoupper(bin2hex(random_bytes(8)));
    $custName = trim(preg_replace('/[^A-Za-z ]/', '', $firstName . ' ' . $lastName));
    if ($custName === '') {
        $custName = 'Customer';
    }

    $names = array();
    foreach ($items as $item) {
        $names[] = $item['name'];
    }
    $description = substr(implode(', ', $names), 0, 255);
    if ($description === '') {
        $description = 'All Day Shopping order';
    }

    return array(
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'address' => $address,
        'town' => $town,
        'state' => $state,
        'postcode' => $postcode,
        'notes' => $notes,
        'items' => $items,
        'amount' => $amount,
        'order_id' => $orderId,
        'cust_name' => substr($custName, 0, 64),
        'description' => $description,
    );
}

function startCheckoutPayment()
{
    $method = strtolower(v('payment_method', 'upi'));
    if ($method === 'card' || $method === 'netbanking') {
        createHostedSession($method);
        return;
    }
    createUpiPayment();
}

function postEncrypted($url, $keys, $payload)
{
    list($httpCode, $decoded) = curlJson(
        'POST',
        $url,
        array(
            'Content-Type: application/json',
            'pass_key: ' . $keys['pass_key'],
            'header_secrets: ' . headerSecrets($keys),
        ),
        json_encode(
            array('RequestData' => aesEncrypt(
                json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                $keys['aes_key']
            )),
            JSON_UNESCAPED_SLASHES
        )
    );
    return array($httpCode, decodeGatewayBody($decoded, $keys['aes_key']), $decoded);
}

function normalizeUpiId($value)
{
    return strtolower(trim((string) $value));
}

function isValidUpiId($value)
{
    return (bool) preg_match('/^[a-z0-9.\-_]{2,256}@[a-z]{2,64}$/', normalizeUpiId($value));
}

function createHostedSession($method)
{
    pruneOldOrders();
    $checkout = collectCheckout();
    $keys = mpurseKeys();
    $payload = array(
        'order_id' => $checkout['order_id'],
        'amount' => $checkout['amount'],
        'currency' => 'INR',
        'action' => 'paymentPage',
        'mode' => 'web',
        'return_url' => siteUrl() . '/order-status?order_id=' . rawurlencode($checkout['order_id']),
        'customer_id' => $checkout['order_id'],
        'customer_email' => substr($checkout['email'], 0, 128),
        'customer_phone' => $checkout['phone'],
        'first_name' => alphaName($checkout['first_name'], 'Customer'),
        'last_name' => alphaName($checkout['last_name'], 'User'),
        'description' => $checkout['description'],
    );

    $url = envVal(
        'MPURSE_SESSION_URL',
        'https://api-prod.mpurse.io/encrV2/mpurse/super-switch/v1/payments/session'
    );
    list($httpCode, $session, $decoded) = postEncrypted($url, $keys, $payload);
    $checkoutUrl = hostedCheckoutUrl($session);

    if ($checkoutUrl === '' || $httpCode >= 400) {
        $message = 'Unable to start card / net banking payment. Please try UPI or try again.';
        if (isset($session['message']) && is_string($session['message'])) {
            $message = $session['message'];
        } elseif (isset($decoded['message']) && is_string($decoded['message'])) {
            $message = $decoded['message'];
        }
        fail(502, $message);
    }

    saveOrder(array(
        'order_id' => $checkout['order_id'],
        'amount' => $checkout['amount'],
        'mid' => $keys['mid'],
        'status' => isset($session['status']) ? (string) $session['status'] : 'NEW',
        'session_token' => isset($session['session_token']) ? (string) $session['session_token'] : '',
        'payment_method' => $method,
        'emailed' => false,
        'created_at' => date('c'),
        'billing' => array(
            'first_name' => $checkout['first_name'],
            'last_name' => $checkout['last_name'],
            'email' => $checkout['email'],
            'phone' => $checkout['phone'],
            'address' => $checkout['address'],
            'town' => $checkout['town'],
            'state' => $checkout['state'],
            'postcode' => $checkout['postcode'],
            'notes' => $checkout['notes'],
        ),
        'cart' => $checkout['items'],
    ));

    ok(array(
        'order_id' => $checkout['order_id'],
        'flow' => 'hosted',
        'checkout_url' => $checkoutUrl,
        'amount' => $checkout['amount'],
    ));
}

function callUpiDirect($keys, $payload)
{
    $url = envVal(
        'MPURSE_UPI_DIRECT_URL',
        'https://api-prod.mpurse.io/encrV2/mpurse/super-switch/v1/payments/upi/direct'
    );
    list($httpCode, $result) = postEncrypted($url, $keys, $payload);
    return array($httpCode, $result);
}

function isUpiStarted($httpCode, $result)
{
    if ($httpCode >= 400) {
        return false;
    }
    $statusCode = gatewayText($result, array('statusCode', 'status_code'));
    $status = strtoupper(gatewayText($result, array('status')));
    $txnId = gatewayText($result, array('txn_id', 'txnId', 'transactionId', 'txnRef'));
    $intent = gatewayText($result, array('intent_url', 'intentUrl', 'upi_intent', 'upiIntent'));
    $qr = gatewayText($result, array('qr_data', 'qrData'));
    $msg = strtolower(gatewayText($result, array('message', 'statusDescription', 'error')));
    if (strpos($msg, 'required') !== false || strpos($msg, 'invalid') !== false || strpos($msg, 'connector error') !== false || strpos($msg, 'request failed') !== false) {
        return false;
    }
    return $statusCode === '00'
        || in_array($status, array('INITIATED', 'PENDING', 'SUCCESS'), true)
        || $txnId !== ''
        || $intent !== ''
        || $qr !== '';
}

function createUpiPayment()
{
    pruneOldOrders();
    $checkout = collectCheckout();
    $keys = mpurseKeys();
    $upiId = normalizeUpiId(v('upi_id', v('upiId')));
    if (!isValidUpiId($upiId)) {
        fail(422, 'Enter a valid UPI ID, like name@okaxis or 9876543210@ybl');
    }
    $payeeVpa = normalizeUpiId(envVal('MPURSE_PAYEE_VPA', '8990100626.mp@nsdlpbma'));
    if (!isValidUpiId($payeeVpa)) {
        fail(500, 'Merchant UPI ID is not configured.');
    }

    $base = array(
        'order_id' => $checkout['order_id'],
        'txnAmount' => $checkout['amount'],
        'channelId' => 'WEBUSER',
        'txnNote' => 'Payment',
        'merchantType' => envVal('MPURSE_MERCHANT_TYPE', 'AGGREGATE'),
        'expiryTime' => envVal('MPURSE_EXPIRY_MINUTES', '10'),
        'cust_name' => $checkout['cust_name'],
        'cust_mobilenumber' => $checkout['phone'],
        'currency' => 'INR',
    );
    $mcc = envVal('MPURSE_MCC', '8999');
    $collect = array_merge($base, array(
        'paymentMode' => 'COLLECT',
        'payerVPA' => $upiId,
        'payeeVPA' => $payeeVpa,
        'payeeName' => envVal('MPURSE_PAYEE_NAME', 'KANIKA ENTERPRISES'),
        'payeeMCC' => $mcc,
        'mcc' => $mcc,
    ));

    list($httpCode, $result) = callUpiDirect($keys, $collect);
    $mode = 'COLLECT';
    if (!isUpiStarted($httpCode, $result)) {
        list($httpCode, $result) = callUpiDirect($keys, array_merge($base, array('paymentMode' => 'INTENT')));
        $mode = 'INTENT';
        if (!isUpiStarted($httpCode, $result)) {
            $message = gatewayText($result, array('statusDescription', 'message', 'error'));
            fail(502, $message !== '' ? $message : 'Could not start UPI payment. Try again in a moment.');
        }
    }

    $txnId = gatewayText($result, array('txn_id', 'txnId', 'transactionId', 'txnRef'));
    $intent = gatewayText($result, array('intent_url', 'intentUrl', 'upi_intent', 'upiIntent'));
    $qr = $mode === 'COLLECT' ? '' : gatewayText($result, array('qr_data', 'qrData'));
    $status = strtoupper(gatewayText($result, array('status')));

    saveOrder(array(
        'order_id' => $checkout['order_id'],
        'amount' => $checkout['amount'],
        'mid' => $keys['mid'],
        'status' => $status !== '' ? $status : 'INITIATED',
        'txn_id' => $txnId,
        'qr_data' => $qr,
        'intent_url' => $intent,
        'payment_method' => 'upi',
        'payment_mode' => $mode,
        'payer_vpa' => $mode === 'COLLECT' ? $upiId : '',
        'emailed' => false,
        'created_at' => date('c'),
        'billing' => array(
            'first_name' => $checkout['first_name'],
            'last_name' => $checkout['last_name'],
            'email' => $checkout['email'],
            'phone' => $checkout['phone'],
            'address' => $checkout['address'],
            'town' => $checkout['town'],
            'state' => $checkout['state'],
            'postcode' => $checkout['postcode'],
            'notes' => $checkout['notes'],
        ),
        'cart' => $checkout['items'],
    ));

    ok(array(
        'order_id' => $checkout['order_id'],
        'flow' => 'upi',
        'pay_url' => '/pay?order_id=' . rawurlencode($checkout['order_id']),
        'amount' => $checkout['amount'],
        'qr_data' => $qr,
        'intent_url' => $intent,
        'payer_vpa' => $mode === 'COLLECT' ? $upiId : '',
        'payment_mode' => $mode,
        'txn_id' => $txnId,
    ));
}

function gatewayText($data, $keys)
{
    if (!is_array($data)) {
        return '';
    }
    foreach ((array) $keys as $key) {
        if (!array_key_exists($key, $data) || is_array($data[$key]) || is_object($data[$key]) || $data[$key] === null || $data[$key] === false) {
            continue;
        }
        $value = trim((string) $data[$key]);
        if ($value === '' || preg_match('/^(null|undefined|none|n\/a)$/i', $value)) {
            continue;
        }
        return $value;
    }
    foreach (array('data', 'result', 'payload', 'payment') as $nested) {
        if (isset($data[$nested]) && is_array($data[$nested])) {
            $found = gatewayText($data[$nested], $keys);
            if ($found !== '') {
                return $found;
            }
        }
    }
    return '';
}

function isStatusLookupMiss($gateway)
{
    $msg = strtolower(gatewayText($gateway, array('message', 'statusDescription', 'error', 'status_description')));
    if ($msg === '') {
        return false;
    }
    return strpos($msg, 'not found') !== false
        || strpos($msg, 'database error') !== false
        || strpos($msg, 'no record') !== false
        || strpos($msg, 'does not exist') !== false;
}

function normalizeStatus($status)
{
    $value = strtolower(trim((string) $status));
    if (in_array($value, array('success', 'successful', 'paid', 'captured', 'completed'), true)) {
        return 'success';
    }
    if (in_array($value, array('failed', 'failure', 'fail', 'cancelled', 'canceled', 'expired', 'declined'), true)) {
        return 'failed';
    }
    return 'pending';
}

function fetchGatewayStatus($lookupId)
{
    $lookupId = trim((string) $lookupId);
    if ($lookupId === '') {
        return array();
    }
    $url = rtrim(envVal(
        'MPURSE_STATUS_URL',
        'https://services.mpurse.io/mpurse/super-switch/v1/payments/status'
    ), '/') . '/' . rawurlencode($lookupId);

    list($httpCode, $decoded) = curlJson('GET', $url, array('Content-Type: application/json'));
    if ($httpCode === 404) {
        return array('status' => 'pending', 'message' => 'Payment not found');
    }
    if ($httpCode >= 500) {
        return is_array($decoded) && $decoded ? $decoded : array('status' => 'pending');
    }
    return is_array($decoded) ? $decoded : array();
}

function confirmPaymentStatus()
{
    $orderId = preg_replace('/[^A-Za-z0-9_-]/', '', v('order_id'));
    if ($orderId === '') {
        fail(422, 'Missing order id.');
    }

    $order = loadOrder($orderId);
    $gateway = fetchGatewayStatus($orderId);
    $savedTxnId = gatewayText($order ?: array(), array('txn_id', 'txnId'));
    if (isStatusLookupMiss($gateway) && $savedTxnId !== '' && $savedTxnId !== $orderId) {
        $byTxn = fetchGatewayStatus($savedTxnId);
        if ($byTxn && !isStatusLookupMiss($byTxn)) {
            $gateway = $byTxn;
        }
    }

    $lookupMiss = isStatusLookupMiss($gateway);
    $rawStatus = gatewayText($gateway, array('status'));
    if ($lookupMiss) {
        $status = 'pending';
        $rawStatus = $order && !empty($order['status']) ? (string) $order['status'] : 'PENDING';
        $message = '';
    } else {
        $status = normalizeStatus($rawStatus);
        $message = gatewayText($gateway, array('message', 'statusDescription'));
    }

    $txnId = gatewayText($gateway, array('txn_id', 'txnId'));
    if ($txnId === '') {
        $txnId = $savedTxnId;
    }

    if ($order && !$lookupMiss) {
        $order['gateway'] = $gateway;
        $order['status'] = $rawStatus !== '' ? $rawStatus : $order['status'];
        if ($txnId !== '') {
            $order['txn_id'] = $txnId;
        }
        if ($status === 'success' && empty($order['emailed'])) {
            $sent = sendOrderPaidEmail($order, $gateway);
            $order['emailed'] = $sent;
            $order['paid_at'] = date('c');
        }
        saveOrder($order);
    } elseif ($status === 'success') {
        sendBarePaidEmail($orderId, $gateway);
    }

    ok(array(
        'order_id' => $orderId,
        'status' => $status,
        'gateway_status' => $rawStatus,
        'amount' => isset($gateway['amount']) ? $gateway['amount'] : ($order ? $order['amount'] : null),
        'txn_id' => $txnId,
        'rrn' => gatewayText($gateway, array('rrn')),
        'message' => $message,
        'qr_data' => ($order && !empty($order['qr_data'])) ? $order['qr_data'] : '',
        'intent_url' => ($order && !empty($order['intent_url'])) ? $order['intent_url'] : '',
        'payer_vpa' => $order && !empty($order['payer_vpa']) ? $order['payer_vpa'] : '',
        'payment_method' => $order && !empty($order['payment_method']) ? $order['payment_method'] : '',
        'payment_mode' => $order && !empty($order['payment_mode']) ? $order['payment_mode'] : '',
    ));
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

function kvRow($label, $value, $multiline = false)
{
    if ($value === '') {
        $value = '-';
    }
    $body = $multiline ? nl2br(clean($value)) : clean($value);
    return '<p style="margin:0 0 8px;"><strong>' . clean($label) . ':</strong> ' . ($multiline ? '<br>' : '') . $body . '</p>';
}

function wrapEmail($subject, $mainContent, $toEmail)
{
    $brandName = 'All Day Shopping';
    $tagline = "India's trusted store for electronics, books, stationery, and garments.";
    $brandColor = '#9333ea';
    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' . clean($subject) . '</title></head>
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
}

function deliverMail($toEmail, $toName, $subject, $html, $alt, $replyEmail = '', $replyName = '')
{
    $smtpHost = envVal('SMTP_HOST');
    $smtpUser = envVal('SMTP_USER');
    $smtpPass = envVal('SMTP_PASS');
    $smtpPort = (int) envVal('SMTP_PORT', '465');
    $smtpSecure = envVal('SMTP_SECURE', 'smtps');
    $fromEmail = $smtpUser !== '' ? $smtpUser : $toEmail;
    $fromName = 'All Day Shopping';
    $autoload = findAutoload();

    if ($autoload && $smtpHost !== '') {
        try {
            require_once $autoload;
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
                $mail->addAddress($toEmail, $toName);
                if ($replyEmail !== '') {
                    $mail->addReplyTo($replyEmail, $replyName !== '' ? $replyName : $replyEmail);
                }
                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body = $html;
                $mail->AltBody = $alt;
                $mail->send();
                return true;
            }
        } catch (Throwable $e) {
        }
    }

    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $fromName . ' <' . $fromEmail . '>';
    if ($replyEmail !== '') {
        $headers[] = 'Reply-To: ' . $replyName . ' <' . $replyEmail . '>';
    }
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    return @mail($toEmail, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, implode("\r\n", $headers));
}

function sendOrderPaidEmail($order, $gateway)
{
    $brandName = 'All Day Shopping';
    $toEmail = 'info@allday-shopping.com';
    $border = '#e5e7eb';
    $brandColor = '#9333ea';
    $billing = isset($order['billing']) && is_array($order['billing']) ? $order['billing'] : array();
    $cart = isset($order['cart']) && is_array($order['cart']) ? $order['cart'] : array();
    $name = trim((isset($billing['first_name']) ? $billing['first_name'] : '') . ' ' . (isset($billing['last_name']) ? $billing['last_name'] : ''));
    $email = isset($billing['email']) ? (string) $billing['email'] : '';
    $orderId = (string) $order['order_id'];
    $amount = (string) $order['amount'];
    $txnId = isset($gateway['txn_id']) ? (string) $gateway['txn_id'] : '';
    $rrn = isset($gateway['rrn']) ? (string) $gateway['rrn'] : '';

    $cartHtml = '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;">
      <tr style="background:#f3f4f6;">
        <th align="left" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">Item</th>
        <th align="center" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">Qty</th>
        <th align="right" style="padding:8px;border:1px solid ' . $border . ';font-family:Arial,Helvetica,sans-serif;">Price</th>
      </tr>';
    $alt = "Paid order {$orderId}\n\n";
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

    $townLine = (isset($billing['address']) ? $billing['address'] : '') . ', ' . (isset($billing['town']) ? $billing['town'] : '');
    if (!empty($billing['state'])) {
        $townLine .= ', ' . $billing['state'];
    }
    if (!empty($billing['postcode'])) {
        $townLine .= ' - ' . $billing['postcode'];
    }

    $mainContent =
        '<tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ' . $border . ';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">Payment</td></tr>
          <tr><td style="padding:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">'
        . kvRow('Order ID', $orderId)
        . kvRow('Amount', 'INR ' . $amount)
        . kvRow('Txn ID', $txnId)
        . kvRow('RRN', $rrn)
        . kvRow('MID', isset($order['mid']) ? (string) $order['mid'] : '')
        . '</td></tr></table></td></tr>
        <tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ' . $border . ';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">Billing</td></tr>
          <tr><td style="padding:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">
            <p><strong>' . clean($name) . '</strong></p>
            <p>' . clean($email) . '</p>
            <p>Phone: ' . clean(isset($billing['phone']) ? (string) $billing['phone'] : '') . '</p>
            <p>' . clean($townLine) . '</p>'
        . (!empty($billing['notes']) ? '<p><strong>Notes:</strong> ' . nl2br(clean((string) $billing['notes'])) . '</p>' : '')
        . '</td></tr></table></td></tr>
        <tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ' . $border . ';border-radius:4px;">
          <tr><td style="background:#f3f4f6;padding:8px 10px;font-family:Arial,Helvetica,sans-serif;font-weight:600;color:' . $brandColor . ';">Order Summary</td></tr>
          <tr><td style="padding:10px;">' . $cartHtml . '</td></tr>
        </table></td></tr>';

    $subject = 'Paid order - All Day Shopping - ' . $orderId;
    $html = wrapEmail($subject, $mainContent, $toEmail);
    $alt .= "Billing: {$name}\nEmail: {$email}\nAmount: {$amount}\n";

    $sent = deliverMail($toEmail, $brandName, $subject, $html, $alt, $email, $name);

    if ($sent && $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $customerHtml = '<p>Hi ' . clean($name) . ',</p><p>We have received your payment of <strong>INR ' . clean($amount) . '</strong> for order <strong>' . clean($orderId) . '</strong>.</p><p>We will process and ship your order shortly.</p><p>Regards,<br><strong>' . clean($brandName) . ' Team</strong></p>';
        deliverMail(
            $email,
            $name,
            'Payment received - ' . $brandName . ' - ' . $orderId,
            wrapEmail('Payment received', '<tr><td style="padding:0 24px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">' . $customerHtml . '</td></tr>', $email),
            'Payment received for order ' . $orderId
        );
    }

    return $sent;
}

function sendBarePaidEmail($orderId, $gateway)
{
    $toEmail = 'info@allday-shopping.com';
    $amount = isset($gateway['amount']) ? (string) $gateway['amount'] : '';
    $txnId = isset($gateway['txn_id']) ? (string) $gateway['txn_id'] : '';
    $subject = 'Paid order - All Day Shopping - ' . $orderId;
    $main = '<tr><td style="padding:0 24px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">'
        . kvRow('Order ID', $orderId)
        . kvRow('Amount', $amount)
        . kvRow('Txn ID', $txnId)
        . '</td></tr>';
    deliverMail($toEmail, 'All Day Shopping', $subject, wrapEmail($subject, $main, $toEmail), $subject);
}
