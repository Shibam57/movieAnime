# Review findings and corrections

| Area | Original issue | Revision |
| --- | --- | --- |
| Startup | No fallback port, misleading error handling, duplicate dotenv configuration | Startup validation, explicit 0.0.0.0 binding, readiness endpoint, graceful shutdown |
| User/Admin models | Missing refreshToken schema field; user email used `require` instead of `required` | Stored hashed refresh token, required email, role/type JWT claims |
| Auth | Same admin/user cookie, cookie overrides Bearer, missing refresh JWT import and wrong destructuring, logout unset undefined | Separate admin cookies, Bearer precedence, rotation with atomic comparison, corrected logout, no raw refresh hash in responses |
| Admin | Public admin registration, dashboard and notification endpoints | Bootstrap key or authenticated admin for registration, authorization for management routes |
| Payments | Untrusted amount, wrong rupee/paise conversion, arbitrary payment record updated, no captured-state check | Server pricing, owner and order binding, HMAC verification, provider capture and amount checks, retry-safe update |
| Episode | Undefined userId, absent authentication, inconsistent Purchase/Payment lookup, paid URL leakage | Optional identity resolution and shared Payment entitlement checks, published parent/release date rules, authorized playback |
| Movies | Admin check after upload, no optional auth on reads, paid public URLs, one-way publish toggle | Auth first, public/admin visibility, redacted media and real toggle |
| Series/Season | Missing request identity and Episode import, unsafe update, orphaned children | Correct visibility, field allowlists, referential deletion checks |
| Media | Public temporary uploads, unsafe filenames, synchronous cleanup and incorrect deletion identifiers | OS temp directory, UUID names, file size/type limits, cleanup and resource-aware Cloudinary deletion, authenticated new videos |
| Search | Raw regex, public unpublished search | Literal bounded search, visibility filters |
| Dashboard | Pending payments counted as revenue, oldest six months shown | Success-only revenue, recent six-month cutoff |
| Errors | Leaked internal errors and converted unrelated errors to authentication errors | Centralized status mapping, safer responses |
| Comments | Invalid model names, wrong field names, missing mongoose import, owner mismatch, incorrect timestamps | Fixed internal controller and model; no routes added |
| Repository | Real .env in original ZIP, unused body-parse dependency | Secret-free template and ignore rules, unused dependency removed, checks and tests |

See README.md for behavioral changes, migration caveats, deployment instructions, and tests that could not be performed. Existing API routes and CommonJS/Mongoose architecture have been preserved. No database migration was run.
