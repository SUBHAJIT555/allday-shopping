# Prompt: add mPurse UPI checkout to a 40Ecom static shop

Copy everything below the line into Cursor on the **target website repo**. Fill the `THIS SITE` block first. Do not paste keys into git, `NEXT_PUBLIC_*`, or client JS.

---

Implement live **mPurse Super-Switch UPI checkout** on this shop, matching the working All Day Shopping (`allday-shopping`) pattern. This site is a **Next.js static export** (`output: "export"`). There is **no Node server in production**. PHP under `public/api/` is the backend (same idea as existing `submit.php`). Production is typically Namehero/LiteSpeed: `yarn build`, upload **contents of `out/`** into `public_html`.

## THIS SITE (fill before coding)

- Brand / storefront name:
- Live site URL (https, no trailing slash):
- Order notify email (merchant inbox):
- Legal / payee name (as on mPurse):
- Phone / address for footer if they must match the merchant:
- mPurse Pass Key:
- mPurse MID:
- mPurse AES Key (base64):
- mPurse Client Secret:
- mPurse Client Id:
- Payee VPA (from a real merchant UPI/QR, e.g. `xxxxxxxxxx.mp@nsdlpbma`):
- MCC (if known, else keep existing / 8999 only if that is this merchant):
- Merchant type (usually `AGGREGATE`):
- SMTP (reuse whatever `submit.php` already uses): SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT
- Local PHP: XAMPP `php.exe` on `127.0.0.1:8088` serving `public/api`

**Do not change** the Woodpay webhook. Leave it as:

`https://callback.woodpay.net/nsdl/v1/upi/callback`

Each merchant’s mPurse keys, MID, VPA, payee name, and site URL **will be different**. Never copy another site’s `.env`.

## What already works (copy behavior, not secrets)

Reference implementation: `allday-shopping` — `public/api/mpurse.php`, checkout → `/pay`, cart persist, `.htaccess` for static export.

### Architecture

1. Browser never talks to mPurse with secrets. Checkout `POST`s JSON to `/api/mpurse.php`.
2. PHP encrypts with AES + `pass_key` / `header_secrets` and calls mPurse.
3. **UPI is Direct UPI**, not hosted checkout:
   - Phone: `paymentMode` `INTENT` → Open UPI app (`intent_url`)
   - Desktop: `paymentMode` `QR` → show QR (`qr_data`, or generate from `intent_url`)
   - If preferred mode fails, retry the other mode with a **new** `order_id`
4. **Do not enable card / net banking** unless this merchant’s hosted page actually works. On Kanika / All Day Shopping, session create succeeds then `https://secure-sdk.mpurse.io/?id=...` shows **Payment Session Expired**. Grey those methods out (“coming soon”) and reject them in PHP with a clear error. Do not send customers to that Oops screen.
5. After UPI starts, redirect to same-origin `/pay?order_id=...`. Poll `POST /api/mpurse.php` `{ action: "status", order_id }`.
6. Treat gateway “Payment not found” / database error as **pending**, not failed. HTTP 200 from PHP is JSON success, not payment success. Confirm paid only from gateway status / statusCode `00`.
7. On paid: email merchant + customer. Secrets stay in gitignored `public/api/.env` (and `mpurse.env` locally if used). Add `public/api/.env` and `public/api/data/*.json` to `.gitignore`.
8. Cart must survive refresh: persist Redux cart to `localStorage` and rehydrate on load (static export does full page loads).

### PHP / env

- Put keys only in `public/api/.env` (gitignored). Example **names** (values are per site):

```
SITE_URL=https://THIS-DOMAIN.com
MPURSE_MID=
MPURSE_PASS_KEY=
MPURSE_AES_KEY=
MPURSE_CLIENT_ID=
MPURSE_CLIENT_SECRET=
MPURSE_PAYEE_VPA=
MPURSE_PAYEE_NAME=
MPURSE_MCC=
MPURSE_MERCHANT_TYPE=AGGREGATE
MPURSE_EXPIRY_MINUTES=10
ORDER_NOTIFY_EMAIL=
MAIL_FROM=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_PORT=465
SMTP_SECURE=smtps
```

- Block `.env` and `api/data/` in `public/.htaccess` / `public/api/.htaccess`.
- Local: `next.config.js` rewrites `/api/*.php` → `http://127.0.0.1:8088/...` **only in development**. Production export has no rewrites; Apache/LiteSpeed serves PHP from `public_html/api/`.
- `yarn php:api` should use the same PHP binary as OpenSSL (XAMPP), e.g. `C:/xampp/php/php.exe -S 127.0.0.1:8088 -t public/api`.
- Endpoints used:
  - UPI: `https://api-prod.mpurse.io/encrV2/mpurse/super-switch/v1/payments/upi/direct`
  - Status GET: `https://services.mpurse.io/mpurse/super-switch/v1/payments/status/{id}`
  - Decrypt `ResponseData` on status if present. Look up **both** merchant `order_id` and gateway `txn_id`.
- `From` for mail must be the site mailbox / SMTP user, **not** the customer’s email.
- Send merchant and customer paid emails **independently** (customer mail must not depend on merchant send succeeding).
- Webhook: if mPurse/Woodpay POSTs to this site, accept it on `mpurse.php`, but **do not replace** the Woodpay callback URL they already configured.

### Frontend / static host

- Checkout is live pay, not RFQ / quote, unless this site is explicitly still quote-only (then replace quote submit with payment).
- `/pay` and `/order-status` poll status and show success only when paid.
- LiteSpeed: Next export often creates both `pay.html` and a `pay/` folder. `Options -Indexes` and rewrite `/pay` → `pay.html` even if a directory exists (skip `/api/`). After build, copy `*.html` into matching folders as `index.html` if that script exists (`scripts/copy-html-indexes.js`).
- Mobile: cart persist; checkout links must actually open `/checkout` (not a folder listing). Prefer `router.push` from the cart drawer so the link is not unmounted mid-tap.
- Do not store secrets in client bundles.

### Branding

Keep **this site’s** storefront brand, colors, and domain. Only legal/payee/footer fields should match the **mPurse merchant** for that site. Do not copy All Day Shopping copy onto other shops.

### Do not

- Put keys in `NEXT_PUBLIC_*`, committed files, or screenshots in git
- Change the Woodpay webhook URL
- Rewrite checkout host to `secure-sdk.mpurse.io.isupay.in` (invalid)
- Enable card/net banking until that merchant’s hosted session actually opens a payment form (not “Payment Session Expired”)
- Use `output: export` rewrites in production Next config
- Clear the cart until payment is confirmed success

### Deploy checklist

1. `yarn build` (and html-index copy if used)
2. Upload `out/` **contents** to `public_html`
3. Upload `public_html/api/mpurse.php`, `submit.php` if needed, `api/.htaccess`, site `.htaccess`
4. Upload **gitignored** `public_html/api/.env` for **this** merchant (merge SMTP if a file already exists — do not wipe SMTP)
5. No `yarn php:api` / Node on the host
6. Test UPI ₹ small amount on phone (intent) and desktop (QR); keep `/pay` open until success; confirm emails (and spam)

### Done when

- UPI pay works on phone and desktop
- Cart survives refresh
- `/checkout` and `/pay` open as pages, not directory listings
- Paid orders email merchant + customer
- Card/net banking do not dump users on mPurse “Oops / Session Expired”
- Keys are not in the Next bundle or git

---
