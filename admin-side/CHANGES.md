# Changes from original admin-side.zip

| Original problem | Revision |
|---|---|
| Layout was accessible without an admin check | Profile-verified RequireAdmin gate and protected route tree |
| localStorage token used inconsistently; cookie-only calls failed cross-origin | Central Axios service, admin Bearer headers, per-tab session, refresh rotation, local sign-out |
| Signup submitted FormData while declaring JSON; no registration key | JSON registration using backend's authorized admin or bootstrap-key contract |
| Dashboard used raw fetch; stats initially displayed undefined | Authenticated shared resource hook with loading, errors, retry and real backend fields |
| Movies required an isAdmin prop never passed by App | Authenticated movie list always exposes permitted admin controls; publish, delete confirmation, proper server pagination |
| Series listing lacked edit, publish, delete and next-page bounds | Added supported operations and full-page pagination heuristic |
| Season/episode edit links had no matching routes | Removed unsupported season edit; implemented episode metadata edit and series edit |
| Uploads had missing required fields, manual multipart headers, no busy/progress | Shared content form matching backend field names, price/MIME/size checks, ISO release dates, long upload timeout and upload status |
| User list used regular user profile and nonexistent delete API | Real aggregate count; clear explanation of missing protected endpoints |
| Settings logged password and did not save | Actual admin profile, no fake form, registration link |
| Payments read status/statusCode instead of paymentStatus and used dollar icon | Correct success/pending/failed field, currency formatting, content and transaction data, filters |
| Notifications lacked mark-read and robust loading | Actual mark-read endpoint, unread count, retry |
| Hardcoded API proxy targeted a different Render hostname | Configurable local proxy and production API base URL |
| Duplicate ToastContainer and unused starter assets | One global toast container, removed unused Vite starter files and unused Card component |
| Fixed sidebar / no mobile controls | Responsive sidebar, labeled form controls and action buttons |

Dependencies and lockfile were preserved to avoid unverified upgrades. Project is not claimed production-ready until full build/browser/backend integration and dependency review are complete. See README for limitations and verification steps.
