# URL Navigator — Security Review questionnaire (draft answers)

**How to use this file:** The Partner Security Review portal asks many free-text and yes/no questions. Labels change over time. Use the **Topic** column to find the matching question in the portal, then copy or shorten the **Suggested answer**. Update **package version** and **`04t`** whenever you ship a new build.

**Align with:** [`PACKAGE_DOCUMENTATION.md`](PACKAGE_DOCUMENTATION.md) (full technical detail). **Steps:** [`SECURITY_REVIEW_SUBMISSION_STEPS.md`](SECURITY_REVIEW_SUBMISSION_STEPS.md).

**Current package version for submission:** **0.1.0.4**  
**Subscriber Package Version Id:** `04tQj000000GuO1IAK`  
**Subscriber Package Id:** `0HoQj000000021pKAA`  
**Namespace:** `cvplus`

---

## A. Solution identity

| Topic | Suggested answer |
| --- | --- |
| Solution / app name | **URL Navigator** |
| Short description | Managed 2GP package that adds one Flow Screen Lightning web component to redirect the user to a Flow-configured URL (same tab or new tab), with client-side URL validation. Namespace: **cvplus**. |
| Package type | **Second-generation managed package (2GP)** |
| Subscriber Package Version Id to review | `04tQj000000GuO1IAK` (update if you submit a newer version) |
| Namespace | `cvplus` |

---

## B. Architecture and code

| Topic | Suggested answer |
| --- | --- |
| Languages / runtimes | **Lightning Web Components (JavaScript)** only in this package. **No Apex**, no Visualforce from this package. |
| Server-side logic | **None** in this package. No Apex classes, triggers, or batch jobs shipped. |
| Client-side logic | Single LWC bundle **`flowUrlRedirect`** (`cvplus__flowUrlRedirect` when installed). Validates URLs in **`urlRedirectUtils.js`**. Uses standard **`lightning:`** base components in markup. |
| External JavaScript libraries | **None.** No CDN scripts, no npm bundles in the package beyond LWC compilation. |
| APIs exposed | **None** from this package (no REST, no SOAP, no Connect endpoints defined by this package). |
| Callouts / HTTP from package code | **None.** No `fetch`, `XMLHttpRequest`, or Named Credential usage in shipped code. |

---

## C. Data and privacy

| Topic | Suggested answer |
| --- | --- |
| Data stored by the package | **None.** The component does not insert or update Salesforce records. Flow inputs (**Public URL** / `targetUrl`, **Open in new window**) exist only in the browser for the Flow screen lifetime. |
| Personal data | The component does not require PII. Any data appearing in a URL is determined solely by the **subscriber’s Flow design** (out of scope of package code). |
| Encryption | N/A for stored package data (none). Transport uses standard Salesforce / HTTPS session. |
| CRUD / FLS / sharing | **Not applicable** — no SOQL, DML, or object access in package code. |

---

## D. Security controls (navigation / XSS)

| Topic | Suggested answer |
| --- | --- |
| URL / open redirect | **Public URL** is validated client-side: only `http:`/`https:` without embedded credentials, or same-origin org-relative paths starting with `/` (not `//`). Blocks `javascript:`, `data:`, control/invisible/bidi spoof characters, length over 8000, backslashes. Relative URLs must resolve to the **same origin** as the Lightning session. |
| New tab | When opening a new tab, uses `window.open(..., 'noopener,noreferrer')`. |
| Same tab | Dispatches `FlowNavigationFinishEvent`, then deferred `window.location.assign(href)` so the Flow screen can finish. |
| XSS | Error text is **static string literals** in the controller, rendered with **`lightning-formatted-text`**. **Public URL** is not written into `innerHTML` or unsafe DOM APIs. |

---

## E. Authentication and integrations

| Topic | Suggested answer |
| --- | --- |
| Authentication model | Uses the **standard Salesforce user session** in Lightning. No separate OAuth client or API keys in the package. |
| Named Credentials / Remote Site Settings | **None** introduced by this package. |
| External cloud services | **None** invoked by package code. |

---

## F. Testing and install for reviewers

| Topic | Suggested answer |
| --- | --- |
| How to install | Use Subscriber Package Version Id **`04tQj000000GuO1IAK`**. Production: `https://login.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK` — Sandbox: `https://test.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK` |
| How to test | Install package → **Flow Builder** → new **Screen Flow** → add screen component **URL Navigator — Flow URL Redirect** → set **Public URL** (e.g. `https://www.example.com` or `/lightning/page/home`) → set **Open in new window** as needed → run Flow. |
| Automated tests | No Jest tests shipped in the managed package source; manual test as above. (Adjust if you add tests later.) |

---

## G. Compliance and scope

| Topic | Suggested answer |
| --- | --- |
| Components in scope | One **`LightningComponentBundle`**: `flowUrlRedirect`. No custom objects, tabs, or Apex. |
| Subscriber configuration | Subscribers supply **Public URL** and optional **Open in new window** from **trusted Flow logic**; untrusted end-user text should not be passed directly without subscriber-side controls. |

---

## H. Change log for this questionnaire

| Version | Date | Notes |
| --- | --- | --- |
| 1.0 | 2026-06-05 | Initial draft for URL Navigator; package **0.1.0.4** / `04tQj000000GuO1IAK` |
| 1.1 | 2026-06-05 | Cross-links aligned with README / 2GP / PACKAGE_DOCUMENTATION |
