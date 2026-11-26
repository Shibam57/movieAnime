# Review and change log

## Findings from the uploaded code

| Area | Original issue | Revision |
| --- | --- | --- |
| API configuration | Development proxy pointed to a hardcoded hosted backend; production static builds had no API base | Environment-controlled Axios origin and local development proxy |
| Authentication | Cached localStorage user/token, no refresh or backend logout integration across screens | Verified profile restoration, central session, single-flight refresh, logout and protected profile/purchases |
| Payments | Client-supplied prices, nonexistent `buyContent`, payment route merely checked access and navigated, unhandled verification errors | Server-priced order, real checkout, server verification before unlock, same-tab retry, cancellation and busy state |
| Playback | Movies expected nonexistent `videoUrl_1080p/720p/480p`; episodes read metadata URLs directly | `videoFile` and dedicated episode playback endpoint; explicit access check and no player for locked content |
| Search | Unescaped queries, stale requests, nonexistent `/details/:id`, all results rendered as series | Debounced/cancelled search; encoded query and correct type-specific links |
| Catalog | Relative path `api/v1/movies`, mixed list response shapes, missing errors, genre object assumption | Normalized movie/series responses, pagination and sort, string genre support, empty/error states |
| Series | Effect depended on a changing context function, potential repeated requests, wrong paid-series card links | Stable access hook; series details own purchase flow; correct season navigation |
| Profile/purchases | Unvalidated cached user and stale purchase data | Auth guard, validated profile, purchase refresh and typed links |
| UX | Nonfunctional bell, unsupported footer/pricing links, placeholder path missing, unclickable trending items, poor mobile search | Working links, accessible search/navigation, local fallback image, responsive cards, meaningful errors and retries |
| Landing page | Dozens of repeated remote image hotlinks, duplicated homepage behind login, unsupported subscription claims | Real API artwork, retained brand and local video, simpler login and signup, truthful free/paid messaging |
| Deployment | No environment template, SPA fallback or source hygiene | `.env.example`, `.gitignore`, static hosting rewrite documentation, package lock retained |

## Files and design choices

- `src/services/api.js`: shared client and token refresh. `checkout.js`: lazy-load official checkout script.
- `src/hooks/useApiResource.js`, `useAccess.js`: request cancellation, stale-route protection, explicit access checks.
- `src/utils/contracts.js`: API response guards, route mapping, money/genre formatting.
- Shared `ContentCard`, `Catalog`, `Poster`, `State`, `VideoPlayer`, `PurchaseButton`, `RequireAuth` components remove repetitive request/UI code. The existing movies and series card files are retained as wrappers. `MovieDetails` and `SeasonPage` are aliases rather than stale duplicate implementations.
- Preserved the React/Vite/Tailwind stack, Axios, existing route paths and logo/video assets. The new canonical `/episodes/:episodeId` route is necessary because the backend search and purchase results provide episode IDs without parent route IDs.
- Replaced inaccessible placeholder JPEG with a local SVG. Removed unused Vite/React logos, unused SeasonHighlight component and empty App.css. Retained the existing dependency graph (including unused original packages) rather than attempting an unverified dependency upgrade or lockfile rewrite.
- The frontend now uses per-tab Bearer sessions to avoid cross-origin cookie requirements. This is an explicit compatibility choice, not a claim of complete XSS protection.
- Payment recovery is limited to an available same-tab callback record. Backend-side webhook/reconciliation remains necessary.

## Verification limits

Static parsing/import checks and eight helper tests passed. Dependency install was blocked by npm DNS lookup failures, so production bundling, linting and runtime/real-service tests are pending. Use the README's test checklist. No backend, database, admin app or hosted service was modified by this archive.
