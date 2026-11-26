# movieAnime backend — reviewed revision

This is a revision of the supplied CommonJS Node.js / Express / Mongoose backend. Existing `/api/v1` route names and the usual `ApiResponse` envelope are retained. No frontend, database or external account was modified.

## Run locally (Node 22)

PowerShell, from the extracted backend directory:

```powershell
npm ci
Copy-Item .env.example .env
# Open .env and populate every required variable using your own credentials.
npm run check
npm test
npm run dev
```

The API is available at `http://localhost:8000` if using the example port. `GET /health` reports database readiness. To create strong secrets locally, run the following separately for each JWT secret and admin registration key:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never publish `.env`. The original archive contained credentials. Rotate the Atlas database password, JWT secrets, Cloudinary API secret and Razorpay API credentials where applicable, and invalidate existing sessions. If `.env` was ever committed, merely adding `.gitignore` does not remove the historical exposure. Review Git history and revoke old credentials. The supplied credentials were not used or copied into this revision.

## Render deployment

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Branch | main |
| Root directory | backend (when inside your movieAnime monorepo) |
| Build command | npm ci |
| Start command | npm start |
| Health check path | /health |
| NODE_ENV | production |

Use the actual existing environment variable names shown in `.env.example`, especially `MONGODB_URL` (not `MONGODB_URI`). Set `CORS_ORIGIN` to a comma-separated list of the actual HTTPS frontend and admin origins (no path), and allow the service's outbound IP ranges in Atlas. Render supplies `PORT`; do not hardcode it. If your deployment has one trusted reverse proxy hop, set `TRUST_PROXY=1` after verifying topology; otherwise leave it at 0. Rate limiting is in memory per process and is not a replacement for a distributed limiter. For public use, consider account/IP-based distributed rate limits and a direct-to-Cloudinary signed upload workflow. `MAX_UPLOAD_MB` defaults to 100 per file; hosting and Cloudinary account limits also apply.

## Required frontend compatibility checks

- Log in again on both frontends after deploying. JWTs now contain role and type claims; previous tokens are intentionally rejected. User cookies remain `accessToken` and `refreshToken`; admin cookies are now `adminAccessToken` and `adminRefreshToken`. The JSON login and refresh responses still return `accessToken` and `refreshToken`. When sending a Bearer token it takes precedence over cookies. Use the user token for user/payment calls and the admin token for dashboard/notifications/content management. Do not send literal `Bearer undefined`. For cookie authentication send `credentials: 'include'` or Axios `withCredentials: true`. Some browsers block cross-site cookies; use same-site domains or an explicitly authenticated Bearer request. Avoid exposing refresh tokens to untrusted scripts; if changing the frontend, prefer secure HttpOnly cookie storage. Logout invalidates stored refresh tokens; already issued access tokens expire naturally.
- Admin registration: `POST /api/v1/admins/admin-register` now requires an authenticated admin or an `X-Admin-Registration-Key` header matching a strong temporary `ADMIN_REGISTRATION_KEY` server variable. Use Postman for first admin creation and unset the key afterwards. Never include this key in frontend code. Existing admins can log in as usual. New admin refresh route: `POST /api/v1/admins/refresh-token`.
- Dashboard and notifications are now admin-only. Admin lists include unpublished content when the admin token is provided. Public movie and episode detail endpoints return metadata without video URLs for unauthorized viewers; the playback route returns 401/403 when locked. The UI should display a purchase button and refetch details or `/api/v1/episode/play-episode/:episodeId` after payment. Paid list entries intentionally omit video URLs even for purchasers; use the detail/play endpoint. Free published content still includes playable links. Movie toggle now toggles both ways.
- Payments: the backend ignores client-supplied amount and calculates the order from database price in INR. Use `order.amount` and `order.currency` returned by Razorpay, not the original frontend amount. Pass the returned `paymentId` with the three Razorpay verification fields to `/api/v1/payments/verify`. A captured payment is required; enable automatic capture in Razorpay test settings and verify in test mode first. Successful payment records use rupees, while Razorpay uses paise. Episode purchase or full series purchase grants episode access; the existing payment model does not sell seasons. The legacy Purchase collection remains present but is not used for access; reconcile legitimate legacy purchases if any.
- Series and seasons with dependent content now return 409 on deletion rather than leaving orphaned documents or silently destroying videos. Delete the child episodes/movies first. Episode update accepts metadata fields only, not arbitrary replacement URLs. Comments were not routed in the original app and remain unmounted; the internal controller/schema defects were corrected but the feature needs a frontend/API contract before enabling it.

## Data and media migration (important)

Back up MongoDB before deploying. The previous payment implementation accepted client prices, incorrectly stored some amounts, and failed to bind verification to the correct account/order. Existing successful records are not retroactively verified by this revision. Audit them against Razorpay before trusting historical entitlements or revenue; reconcile incorrect records, purchasedContent entries and pending payments manually. Do not blindly multiply all amounts. New payments are verified against the stored order, owner, amount, currency and captured provider status. No webhook, automatic refund/reconciliation, or distributed transactional checkout has been added; a production payment flow needs these, as well as duplicate-order prevention and monitoring.

New videos are uploaded with Cloudinary `authenticated` delivery and signed URLs are returned only through permitted API responses. Signed URLs can be copied/reused by viewers and are not DRM or expiring entitlement tokens. Existing public Cloudinary URLs remain publicly reachable outside this API: migrate those videos to authenticated delivery, update database URLs and invalidate/remove their old public variants before selling access. Verify video playback (including seeking/range requests) using the actual Cloudinary account. For strict paid streaming use a provider-supported expiring token or DRM architecture. Uploaded file MIME is only a preliminary check; Cloudinary is configured with the expected media resource type. Temporary uploads are no longer publicly served. The leftover JPEG in the original `public` folder was omitted as it was not referenced by the source code.

## Validation performed

- `npm run check`: 52 JavaScript source files pass Node syntax and local relative import checks.
- `npm test`: nine dependency-free helper tests passed (input validation, safe regex, pagination, price, CORS/cookies, rate limiting).
- `npm ci` was attempted but the execution environment could not resolve registry.npmjs.org (EAI_AGAIN). Dependencies could not be installed and the Express service, actual MongoDB/Cloudinary/Razorpay requests and frontend flows were not run. Package-lock versions are otherwise retained; the unused body-parse package was removed from package.json and package-lock.json. Run `npm audit` after installation and review any updates (especially upload middleware) before production. This is not a completed security audit or a guarantee of production readiness.

### Integration smoke test after installation

1. Start with test credentials and a development database. Confirm `/health` is 200.
2. Register/login a user; call `/users/profile` with the correct access token, refresh once, confirm replay of old refresh token returns 401. Verify logout and expired access token behavior.
3. Attempt admin registration without key and dashboard with a user token: expect 403/401. Login as an existing admin and confirm both dashboard and notifications work.
4. Create an unpublished movie/series, season and episode with small valid test media. Verify an anonymous listing does not reveal unpublished content, publish, test free playback and paid metadata with no video URL. Verify wrong-role access fails.
5. Create a Razorpay test order with a deliberately altered client amount; confirm the returned amount matches the database price. Check verification for a wrong user/order/signature, uncaptured payment and valid captured payment; retry valid verification and ensure one entitlement. Confirm purchaser playback and anonymous denial.
6. Verify admin delete and update paths, Cloudinary media removal, non-admin uploads rejected, oversized and invalid MIME uploads rejected. Verify both frontend origins and cookie behavior on Render.

## References
- Razorpay Node SDK payment verification: https://github.com/razorpay/razorpay-node/blob/master/documents/paymentVerfication.md
- Cloudinary access control: https://cloudinary.com/documentation/control_access_to_media
- Cloudinary Node uploads: https://cloudinary.com/documentation/node_image_and_video_upload
