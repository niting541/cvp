# cvplus — Security review package documentation

This document supports **Salesforce Security Review** and **AppExchange** submission for the **cvplus** managed package (namespace: **cvplus**). It describes the **Flow URL Redirect** Lightning web component (`flowUrlRedirect`).

## Solution overview

| Item | Detail |
| --- | --- |
| **App / package name** | cvplus |
| **Primary metadata** | Lightning Web Component bundle `flowUrlRedirect` |
| **Surface** | Flow **Screen** component only (`lightning__FlowScreen`) |
| **Purpose** | Navigate the user to an **admin-configured** URL from a Flow screen: same tab (`window.location.assign`) or new tab (`window.open` with `noopener,noreferrer`). |
| **Distribution** | **Second-generation managed package (2GP)**. Dev Hub package name: `cvplusUrlRedirect` (`0HoQj000000021pKAA`). **Current installable version:** **0.1.0.2**, Subscriber id **`04tQj000000Gta1IAC`** (alias `cvplusUrlRedirect@0.1.0-2` in `sfdx-project.json` → `packageAliases`). Update this row when you ship a new `04t`. |

There is **no Apex**, **no callouts**, **no OAuth**, **no data persistence**, **no custom objects**, and **no third-party JavaScript libraries** in this package slice.

## Data handling and privacy

- The component reads two **Flow input** properties only: `targetUrl` (string) and `openInNewWindow` (boolean).
- Values exist **only in browser memory** for the lifetime of the Flow screen; nothing is written to Salesforce storage by this component.
- No Personal Identifiable Information (PII) is required by the component itself. Any PII that appears in a URL is determined entirely by **subscriber Flow design** (out of scope for this component’s code).

## Trust and open-redirect posture

This component performs **client-side navigation** to URLs supplied by **Flow configuration** (typically built from constants, formulas, or field values your admins choose).

- **Security reviewers and subscribers** should treat `targetUrl` as **privileged configuration**: untrusted end users must not be able to control the full URL string (for example via unsanitized free-text that is passed straight into this input).
- The implementation **restricts** what can be opened:
  - **Allowed**: `http:` and `https:` absolute URLs **without** embedded username/password, or a **single leading-slash** org-relative path (not `//`), resolved with the Lightning session origin.
  - **Blocked**: other schemes (`javascript:`, `data:`, `ftp:`, etc.), newlines / null bytes, backslashes, bidirectional override characters, common invisible Unicode format characters, strings over **8000** characters, and URLs with **userinfo** (`https://user:pass@host`).
- **New tabs** use `window.open(..., 'noopener,noreferrer')` to reduce `window.opener` abuse.

Recommend **https** for production external links; **http** is permitted for legacy scenarios and is documented here for transparency.

## Client-side security controls (LWC / Locker)

- Uses standard LWC APIs and `lightning-formatted-text` for error text (no unsafe HTML binding).
- No `eval`, dynamic script injection, or `innerHTML` with untrusted content.
- Runs on the **Salesforce Lightning platform** (Locker / LWS per Salesforce release).

## Authentication and authorization

- No separate authentication mechanism. Navigation stays within normal **Salesforce session** rules for same-tab org URLs; external URLs load under the **browser** and destination site policies.
- **CRUD/FLS** and **sharing** are **not applicable** to this component because it does not query or mutate Salesforce records.

## External integrations

- None initiated by this component (no `fetch`, no `XMLHttpRequest`, no third-party SDKs).

## Accessibility

- Loading state uses `lightning-spinner` with `alternative-text`.
- Errors are exposed with `role="alert"` and `aria-live="assertive"`.
- The close control is a `lightning-button` with a clear label and title.

## Testing

Automated **Jest** unit tests validate URL acceptance and rejection rules in `force-app/main/default/lwc/flowUrlRedirect/__tests__/urlRedirectUtils.test.js`. Run from the project root:

```bash
npm run test:unit
```

## Package contents (this submission slice)

For the **cvplus URL Redirect** manifest, deploy or package **only**:

- `LightningComponentBundle` → `flowUrlRedirect`

See `manifest/package-cvplus-urlRedirect.xml`. **Flows are intentionally omitted** from this manifest per product scope; subscribers add their own Flows that reference the managed component.

For **2GP** (managed package versions from this repo), see `docs/README-2GP-SETUP.md` and `sfdx-project.json` (`package`, `versionNumber`, `packageAliases` after package create).

## Namespace and managed packaging

After you register the **cvplus** namespace on your Dev Hub, create the managed package and versions per **`docs/README-2GP-SETUP.md`**. In subscriber orgs, the component API name appears with the namespace prefix (for example `cvplus__flowUrlRedirect` in API contexts, per Salesforce rules).

## Document control

| Version | Date | Notes |
| --- | --- | --- |
| 1.0 | 2026-06-02 | Initial security-review package doc for Flow URL Redirect LWC |
| 1.1 | 2026-06-02 | Earlier draft namespace **cvp** (not used) |
| 1.2 | 2026-06-02 | Namespace **cvplus** |
| 1.3 | 2026-06-02 | 2GP wiring in `sfdx-project.json`; added `docs/README-2GP-SETUP.md` |
| 1.4 | 2026-06-03 | Note 2GP distribution and that live package/version ids live in `sfdx-project.json` |
| 1.5 | 2026-06-03 | Reference **v0.1.0.2** / **`04tQj000000Gta1IAC`**; same-tab redirect fix in build |
