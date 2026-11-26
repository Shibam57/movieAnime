# MovieAnime Admin Panel

React 19 / Vite 7 / Tailwind CSS 4 / Axios / Recharts admin frontend. Intended to work with `movieAnime-backend-fixed.zip` from the earlier revision, not the original deployed backend. The checked backend archive was inspected directly for route paths, request fields and response formats. No backend files are modified by this ZIP.

## Local setup (PowerShell)

1. Back up your current `admin-side` folder and extract this archive into your MovieAnime repository. Keep `backend` and `user-side` unchanged.
2. Use a supported Node version compatible with Vite 7 (e.g. Node 22.16.0 or later compatible Node 22 release).

```powershell
cd admin-side
npm ci
Copy-Item .env.example .env
npm test
npm run lint
npm run build
npm run dev
```

Open http://localhost:5174. The development server uses port 5174 (strict). Start the revised backend separately using its own configuration. Set `DEV_API_TARGET` to the actual backend port (`http://localhost:8000` by default in this frontend template; use `http://localhost:4000` if that is your backend's port). Leave `VITE_API_BASE_URL` blank to use the Vite development proxy. Ensure the backend `CORS_ORIGIN` allows `http://localhost:5174` and your user-side origin.

### Authentication

Sign in again after the backend upgrade; old tokens are incompatible. Login expects `{data: {admin, accessToken, refreshToken}}`. The admin session is isolated from the user-side session, stored in sessionStorage (with in-memory fallback). Axios attaches the admin Bearer token and refreshes near expiry or on a 401. Concurrent refresh calls share one in-flight request per browser tab. The backend must continue to enforce admin permissions, because a client-side route guard is not a security boundary. The backend supports only one stored refresh token per admin; multiple devices/tabs can invalidate each other's sessions. JavaScript-accessible tokens remain vulnerable to XSS; a same-site HttpOnly-cookie design would provide stronger token protection.

To bootstrap the first admin, set `ADMIN_REGISTRATION_KEY` on the backend only, then enter the key in the registration form at `/signup`. The form sends the key in a header; never put it in Vite variables or commit it to Git. Already authenticated admins can register other admins without this key. Restrict/remove the bootstrap key when no longer needed. Do not use regular user credentials for admin login.

## Render static site deployment

- Repository: MovieAnime repository, branch `main`
- Root directory: `admin-side`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Environment: `VITE_API_BASE_URL=https://movieanimebackend.onrender.com` (the URL shown in your backend deployment; verify the corrected backend is actually deployed there). No `/api/v1` suffix. Optionally `VITE_MAX_UPLOAD_MB=100` to match the server `MAX_UPLOAD_MB` and `NODE_VERSION=22.16.0` or a compatible release.
- In Redirects/Rewrites set Source `/*`, Destination `/index.html`, Action `Rewrite`. `_redirects` is provided for platforms that read it; configure Render explicitly.
- In backend Render Environment, add the actual HTTPS admin site origin to `CORS_ORIGIN`, preserving the user-side origin as a comma-separated entry. Redeploy the backend if required.
- Vite environment values are embedded during build and public. Never add MongoDB, Cloudinary, Razorpay secrets, JWT secrets or `ADMIN_REGISTRATION_KEY` to frontend configuration.

## Supported features

- Admin login, guarded layout, authorized registration, automatic refresh, logout, read-only profile.
- Dashboard/analytics; recorded payment totals and monthly data, not settlement reports.
- Movie create/list/search/sort/paginate/publish/unpublish/delete. Movie duration is automatically provided by the backend upload.
- Series create/list/search/sort/paginate/publish/unpublish/edit/delete; optional thumbnail replacement.
- Seasons create/list/delete; episode create/list/metadata edit/delete. Episode release date uses local time input and is sent as ISO UTC.
- Payment list/search/status filters; notifications and mark-as-read.
- Upload MIME/size checks, progress and duplicate-submit prevention. Size limit is per file, not a guarantee of hosting provider acceptance. If an upload times out, check the list before retrying to avoid duplicates.

## Backend limitations (not hidden by mock data)

The provided revised backend has no admin user-directory/create/delete routes, no admin profile/password update route, no movie metadata update route and no season edit route. The UI provides the aggregate user count and read-only admin profile, and omits unsupported mutation buttons. Episode editing is metadata-only (no replacement video/thumbnail endpoint). Series listing returns an array with no total-page metadata; the Next control is enabled only when the current page is full and may lead to an empty last page. To clear all genres and replace a thumbnail, save the empty genres first, then replace the thumbnail. Notifications and payments are unpaginated on the current server; server-side paging is recommended for large datasets. Public/optional-auth content endpoints can fall back to public visibility if a token becomes invalid on the server before local expiry; sign in again if drafts unexpectedly disappear. Backend user-management and profile endpoints require a separate backend update, not fabricated frontend API calls.

## Test checklist

Verified in the revision environment: 8 pure Node helper tests, syntax parse of 34 JS/JSX files, 132 import declarations (local path and declared package checks), dependency manifest/lock consistency, archive integrity. Original dependency versions retained; no current dependency audit verified. npm ci could not complete: offline cache missing packages, registry DNS lookup failed/online install timed out. Full Vite build, ESLint, browser UI, actual database access, media uploads, payment data and auth integration remain unverified.

Before deployment: run `npm ci`, `npm audit` (review advisories; avoid blindly using `--force`), `npm test`, `npm run lint`, `npm run build`. Test with a staging DB and Cloudinary account. Check unauthenticated URL redirect; user token rejection; successful admin login/refresh/logout; reload a nested route; invalid/valid file and price; create a draft movie/series, publish/unpublish; season/episode CRUD as supported; payment status values and notification mark-as-read. Confirm backend refuses unauthorized registration, writes and deletes. Test mobile menu, search and empty/error states. Do not test destructive deletes on real purchased content without backups and review.
