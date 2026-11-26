# MovieAnime — user-side frontend (revised)

React 19 / Vite / Tailwind CSS 4, Axios, React Router, Framer Motion and Razorpay Checkout. This is the user-facing application, not the admin frontend or backend. It retains the original MovieAnime dark theme, logo and background video asset, with streamlined navigation and catalog layouts.

## Compatibility

Target: `movieAnime-backend-fixed.zip` (the revised Express/Mongoose backend). The revised API is required for JWT role/type claims, rotating refresh tokens, server-priced Razorpay orders, protected playback and purchase history. Existing old tokens are intentionally not restored. Log in again after deployment. The previous backend is not a supported target.

## Local setup (PowerShell)

Use Node.js 22.12+ (prefer a supported Node 22 release) and npm. Start the corrected backend on port 8000 first. Its `CORS_ORIGIN` must include `http://localhost:5173` (and any admin origin you use).

```powershell
cd user-side
npm ci
Copy-Item .env.example .env
```

Edit `.env`:

```dotenv
VITE_API_BASE_URL=
DEV_API_TARGET=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_public_test_key_id
```

The Vite development proxy forwards `/api` to the backend. If the backend uses another port, edit `DEV_API_TARGET`. The Razorpay key ID must match the backend's Razorpay test account and mode. Do not put the Razorpay secret, MongoDB URI or JWT signing secrets in this frontend; `VITE_` values are public in the built JavaScript. Restart Vite after editing environment variables.

```powershell
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Keep the backend running. Check `http://localhost:8000/health` if the frontend cannot load data.

## Render deployment (Static Site, not Web Service)

If the Git repository contains `backend/`, `user-side/` and an admin application, create a separate Render Static Site for `user-side/`:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root Directory | `user-side` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Start Command | None (static site) |

Set environment variables in the static site before building:

- `VITE_API_BASE_URL=https://YOUR-ACTUAL-BACKEND.onrender.com` (origin only, no `/api/v1` suffix)
- `VITE_RAZORPAY_KEY_ID=your_public_key_id`
- `NODE_VERSION=22.16.0` or a supported newer compatible Node 22 release

In Render's Redirects/Rewrites settings, add **Rewrite**: source `/*`, destination `/index.html` (not a redirect). This lets React Router handle direct links and page reloads. The included `public/_redirects` is for hosts that support that file (e.g. Netlify); configure the Render dashboard rule explicitly.

On your corrected backend service set `CORS_ORIGIN` to the exact HTTPS frontend origin(s), comma-separated (no paths). Redeploy backend after changing CORS. Redeploy static site after changing any Vite variable. Vite's proxy is development-only; the deployed static site must use the backend origin configured at build time.

## API behavior and security

- A single Axios instance attaches user Bearer access tokens. It attempts one refresh on a 401, coalesces concurrent refreshes and retries the original request once. Login/registration do not trigger refresh. Backend `/profile` verifies a restored session rather than trusting a cached user object.
- Access and refresh tokens are stored in **sessionStorage**, not localStorage, to support separate frontend/backend origins even when cross-site cookies are blocked. They survive reloads in the same tab but not a normal tab close. They remain accessible to JavaScript and therefore vulnerable to XSS; for a hardened production architecture prefer same-site HttpOnly cookie sessions with a backend change and an explicit CSRF strategy. Do not share tokens or store them in logs.
- The frontend sends Bearer tokens; cross-origin requests do not require credentialed cookies. Logout calls the backend then clears local session state even if the server fails (a failed server logout is reported). The backend owns authentication and entitlement enforcement. Frontend route guards are not a security boundary.
- Razorpay gets the server-created order amount in paise. The create-order request sends only content ID/type and currency. Payment unlocks only after server verification. If the payment callback arrives but verification fails, this tab stores a retry record in sessionStorage; retry verification without paying again. This does not recover a payment if the tab closes before the callback or the record is lost. Backend webhooks/reconciliation and customer support are required for production payment recovery. Test mode is recommended until verified end to end.
- Movie playback uses `videoFile` from `/api/v1/movies/:movieId`; episode playback uses `data.videoUrl` from `/api/v1/episode/play-episode/:episodeId`. The app supports direct `/episodes/:episodeId` links as well as the old nested episode routes. Paid series seasons remain browsable as metadata, with access verified before playback. No DRM or new encoding ladder is implemented. Browser codecs and Cloudinary delivery must be validated.
- A signed playback URL does not prevent sharing or recording. Existing public Cloudinary videos still need the migration described in the corrected backend documentation.
- The source upload contained a Razorpay test key ID in `.env`. It is a public identifier, not a secret, but the real `.env` has been removed for clean configuration. No secrets are bundled.

## Testing and verification

```powershell
npm test
npm run lint
npm run build
npm run preview
```

The eight dependency-free helper tests passed. All 46 JS/JSX files were parsed and checked for resolvable local imports and declared external dependencies. The original dependency versions and lockfile were retained. The npm registry could not be resolved in the review environment (`EAI_AGAIN`), so installing dependencies failed, Vite was not available, and production build, full ESLint, browser, MongoDB, Cloudinary and Razorpay integration tests were not completed. This archive is a source-code revision, not a verified deployable build.

Manual test before production:

1. Guest: home/trending, movie and series catalog, sort/pagination, genre, search including spaces/special characters, direct episode URL, 404 and back navigation.
2. Signup: invalid email/password/image, valid avatar registration, login error and successful login. Refresh page and check profile; expire access token, verify refresh; logout and confirm protected routes redirect. Try two accounts sequentially.
3. Free video playback and seek buttons, broken image fallback, load/error/retry states, related-content links, mobile navigation and keyboard use.
4. Paid movie, series, and episode: guest login return path, correct server price, Razorpay test checkout cancellation, successful capture, verification failure/retry, existing purchase, access across full-series episodes, purchase history, and account isolation.
5. Deploy static site, verify direct route reload and exact backend CORS origin. Check DevTools Network for API responses and test playback on HTTPS. Do not use live payment mode until the backend captures/validates test payments and recovery behavior is verified.

See `CHANGES.md` for the review findings and implementation decisions.
