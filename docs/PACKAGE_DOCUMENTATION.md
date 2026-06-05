# URL Navigator — Salesforce Package Documentation

**Document type:** Package description, component reference, configuration guide, and reviewer-facing technical summary.  
**Audience:** Security reviewers, solution architects, administrators, and maintainers.  
**Source of truth for versions and IDs:** `sfdx-project.json` (update this document when those values change).

**Navigation:** Major sections are numbered **1–7** below for stable cross-references. This Markdown file has no fixed page breaks; when you convert to **PDF** or **Word**, turn on your tool’s **automatic page numbering** and, if needed, regenerate the table of contents so page numbers match the printed layout.

---

## 1. Introduction

### 1.1 Overview

**URL Navigator** is a small, managed Salesforce package that adds a single **Flow Screen** Lightning web component. The component’s job is to send the user to a destination URL that your Flow supplies—either in the **same browser tab** or in a **new tab**—after applying strict **client-side** URL checks. No Apex, no callouts, and no server-side URL fetch are involved.

### 1.2 Purpose and business use case

| Stakeholder need | How this package helps |
| --- | --- |
| **Guided journeys** | Close a Flow step by sending the user to a Lightning record page, app page, or external site you trust. |
| **Hand-off to external systems** | Open a validated `https://` (or legacy `http://`) link after a Flow collects consent or completes a step. |
| **Same-tab continuity** | Keep the user in one tab when navigating to another Salesforce path (for example `/lightning/...`). |
| **New-tab policies** | Optionally open links in a new tab with `noopener` / `noreferrer` to reduce reverse-tabnabbing risk. |

The **business assumption** is that **administrators** (or trusted automation) define what goes into the URL. The component does not decide business rules; it **validates format and scheme** and performs navigation.

### 1.3 Package identity and references

| Item | Value |
| --- | --- |
| **Product / listing name** | URL Navigator |
| **Registered namespace** | `cvplus` (managed components appear as `cvplus__…` in subscriber orgs) |
| **2GP package CLI alias** | `cvplus` (see `sfdx-project.json` → `package`) |
| **Dev Hub package display name** | URL Navigator (set on Dev Hub with `sf package update`; see `docs/README-2GP-SETUP.md` §2a) |
| **Subscriber Package Id** (`0Ho…`) | `0HoQj000000021pKAA` |
| **Current package version (at time of writing)** | `0.1.0.4` |
| **Subscriber Package Version Id** (`04t…`) | `04tQj000000GuO1IAK` |
| **Production install URL** | `https://login.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK` |
| **Sandbox install URL** | `https://test.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK` |
| **Repository / DX project name** | URL Navigator (`sfdx-project.json` → `name`) |
| **API version (bundle)** | `66.0` |
| **Packaging commands** | See `docs/README-2GP-SETUP.md` |

> **Note:** Always confirm `04t` / `0Ho` values in `sfdx-project.json` → `packageAliases` before publishing or submitting review; they change when you cut new package versions.

---

## 2. Table of contents (index)

| Sec | Section | Topic |
| ---: | --- | --- |
| **1** | [1. Introduction](#1-introduction) | Overview, use case, package IDs and URLs |
| **2** | [2. Table of contents (index)](#2-table-of-contents-index) | This index |
| **3** | [3. Component inventory](#3-component-inventory) | What ships in the package |
| **4** | [4. Component details](#4-component-details) | Deep dive: Flow URL Redirect |
| **5** | [5. Configuration details](#5-configuration-details) | Flow inputs, behaviors, popups |
| **6** | [6. Examples](#6-examples) | Scenarios and expected outcomes |
| **7** | [7. Appendix](#7-appendix) | Limits, versioning, data handling, reviewer notes |

---

## 3. Component inventory

The package contains **one** installable metadata component of subscriber-facing significance:

| Group | Metadata type | Developer name | Purpose |
| --- | --- | --- | --- |
| **User interface** | `LightningComponentBundle` | `flowUrlRedirect` | Flow Screen: validate required **Public URL** (`targetUrl`), then redirect or show errors |

**Bundled source modules** (not separate Salesforce metadata types; they ship inside the bundle above):

| Module | Role |
| --- | --- |
| `flowUrlRedirect.js` | Controller: Flow lifecycle, navigation, errors, `FlowNavigationFinishEvent` |
| `flowUrlRedirect.html` | Markup: spinner, error region, Close button |
| `flowUrlRedirect.css` | Layout and error styling |
| `flowUrlRedirect.js-meta.xml` | Exposure: `lightning__FlowScreen`, properties, labels |
| `urlRedirectUtils.js` | Pure validation: `resolveNavigationHref(raw, baseOrigin)` |

**Not included:** Flows, Apex classes, Custom Objects, Remote Site Settings, Named Credentials, or static resources. Subscribers author their own Flows and add this screen where needed.

---

## 4. Component details

### 4.1 Flow URL Redirect (`flowUrlRedirect`)

#### 4.1.1 Component name and labels

| Context | Name |
| --- | --- |
| **Metadata API name (unpackaged)** | `flowUrlRedirect` |
| **Managed API name (subscriber)** | `cvplus__flowUrlRedirect` |
| **UI master label** | URL Navigator — Flow URL Redirect |
| **Flow palette** | Appears under the bundle’s master label (per org language) |

#### 4.1.2 Purpose and description

When a Flow reaches this **Screen** element, the component runs **once** on load (`connectedCallback`). It:

1. Reads Flow inputs **Public URL** (`targetUrl`, required) and `openInNewWindow`.
2. Normalizes and validates the URL in JavaScript (`resolveNavigationHref`).
3. Either navigates the user or displays a **fixed-template** error message with a **Close** control that dispatches `FlowNavigationFinishEvent` so the Flow can continue or end per your Flow design.

The URL string is **never** inserted into HTML as raw markup; errors use `lightning-formatted-text`.

#### 4.1.3 Inputs (properties)

Both properties are defined in `flowUrlRedirect.js-meta.xml` with `role="inputOnly"` (Flow → component; not written back to Flow output variables by this bundle).

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `targetUrl` (Flow label: **Public URL**) | String | **Yes** | Destination. API name `targetUrl`. Must pass validation (see Section 5). Missing, empty, or invalid → error UI, no navigation. |
| `openInNewWindow` | Boolean | No | If **exactly** `true`, open in a **new** tab. If `false`, `null`, or unset, use **same-tab** navigation after finishing the Flow screen step. |

#### 4.1.4 Outputs and expected behavior

| Outcome | Behavior |
| --- | --- |
| **Valid URL + new window** | `window.open(href, '_blank', 'noopener,noreferrer')`, then `FlowNavigationFinishEvent`. User sees new tab; Flow screen completes. |
| **Valid URL + same tab** | `FlowNavigationFinishEvent`, then `window.setTimeout(..., 0)` → `window.location.assign(href)`. User leaves current Lightning URL for the target. |
| **Invalid URL** | No navigation. Error text (see Section 4.1.6). User can tap **Close** → `FlowNavigationFinishEvent` only. |
| **Popup blocked (new window)** | No navigation. Specific error about popups. **Close** finishes Flow screen. |
| **Browser exception** | Generic blocked-redirect message. **Close** finishes Flow screen. |

There are **no Flow output variables** defined by this component; downstream steps rely on your Flow model (e.g. user already navigated away on success).

#### 4.1.5 Example usage (Flow builder)

1. Install the package and open **Flow Builder**.
2. Add a **Screen** to your Flow.
3. Drag **URL Navigator — Flow URL Redirect** onto the screen layout.
4. Set **Public URL** (`targetUrl`) to a resource such as:
   - A **formula** text that builds `/lightning/r/Opportunity/{!$Record.Id}/view`, or  
   - A fixed `https://` link, or  
   - A **Text** template from trusted fields.
5. Set **Open in new window** to `{!$GlobalConstant.True}` or `{!$GlobalConstant.False}` as required.
6. Connect the screen’s **Next** / outcome paths according to whether you need further steps (remember: on success the user may have already navigated away in same-tab mode).

#### 4.1.6 Error handling

| Condition | User-visible message (summary) | Recovery |
| --- | --- | --- |
| Validation failed | Explains allowed patterns: `http`/`https` without userinfo, or `/` path (not `//`). | User reads message; **Close** fires Flow finish event. |
| `window.open` returned `null` | Browser blocked popup; suggests allowing popups or turning off new window. | Adjust browser or set **Open in new window** to false. |
| `try/catch` around open/assign | Generic block message. | Check browser policies; retry. |

All messages are **compile-time string literals** in the controller, not derived from `targetUrl` content, to avoid cross-site scripting in the error path.

#### 4.1.7 Special configuration notes

| Topic | Note |
| --- | --- |
| **Same-tab timing** | Navigation uses `setTimeout(..., 0)` after `FlowNavigationFinishEvent` so the Flow runtime can tear down the screen before `location.assign` runs. |
| **Origin for relative URLs** | Relative paths resolve with `window.location.origin` (the active Lightning session origin). |
| **HTTPS vs HTTP** | Both `https:` and `http:` absolute URLs are allowed after validation; prefer `https` for production external sites. |
| **Trust model** | Treat **Public URL** (`targetUrl`) as **privileged configuration**. Do not pass unvalidated end-user free text directly from a Screen field into this input without business-side checks. |

#### 4.1.8 Dependencies and prerequisites

| Dependency | Detail |
| --- | --- |
| **Salesforce** | Lightning Experience; Flow with **Screen** support. |
| **Target** | `lightning__FlowScreen` only (not App Builder pages, Experience Cloud, etc., unless Salesforce exposes the same target—follow current platform docs). |
| **Browser** | Modern browser with JavaScript enabled; popups allowed if **Open in new window** is true. |
| **Package install** | Subscriber org must install a package version that contains this bundle. |

---

## 5. Configuration details

### 5.1 Configurable properties (summary)

| Property | UI control type | Options | Default behavior if omitted |
| --- | --- | --- | --- |
| `targetUrl` (Public URL) | Single-line text (Flow) | N/A (value from Flow) | **Required** in Flow Builder. Empty at runtime → error screen with required-field message. |
| `openInNewWindow` | Boolean (Flow) | `true` / `false` | Anything other than Boolean `true` is treated as **same tab**. |

There are **no picklists** on the component itself beyond what Flow provides for boolean wiring.

### 5.2 URL validation rules (`resolveNavigationHref`)

Rules are implemented in `urlRedirectUtils.js` and apply **before** any navigation.

| Rule | Detail |
| --- | --- |
| **Type and trim** | Non-string or whitespace-only → rejected. |
| **Length** | Greater than 8000 characters → rejected. |
| **Control / spoof characters** | Disallows null, CR/LF, VT, FF, Unicode line/paragraph separators, bidi overrides, zero-width/invisible class characters, backslash. |
| **Absolute URLs** | Must parse as `http:` or `https:` only; **no** `username` or `password` in the URL. |
| **Relative paths** | Must start with exactly one leading `/` and **not** start with `//`. Resolved with `baseOrigin`. **Resolved origin must equal** session origin (same-origin guard). |
| **Rejected schemes** | `javascript:`, `data:`, `ftp:`, protocol-relative `//`, etc. |

### 5.3 New window, popups, and messaging

| Setting | Browser effect |
| --- | --- |
| `openInNewWindow = true` | Uses `window.open` with features `noopener,noreferrer` (reduces `window.opener` abuse). |
| Popup blocked | User stays on screen; sees explicit message; must use **Close** or change settings. |
| `openInNewWindow ≠ true` | Same-tab: Flow finish event first, then deferred `location.assign`. |

### 5.4 Accessibility

- Loading: `lightning-spinner` with alternative text **Opening link**.
- Errors: `role="alert"` and `aria-live="assertive"`.
- **Close**: `lightning-button` with label **Close**.

---

## 6. Examples

Each example assumes the Flow screen only contains this component (or that the user reaches it).

### 6.1 External HTTPS (same tab)

| Field | Value |
| --- | --- |
| `targetUrl` | `https://help.salesforce.com/articleView` |
| `openInNewWindow` | `false` |

**Expected outcome:** Flow screen completes; browser navigates to Salesforce Help in the **same** tab. User leaves the original Lightning app context.

### 6.2 External HTTPS (new tab)

| Field | Value |
| --- | --- |
| `targetUrl` | `https://partner.example.com/onboarding` |
| `openInNewWindow` | `true` |

**Expected outcome:** New tab opens with the URL; Flow screen completes in the original tab. If the browser blocks popups, user sees the popup error and **Close**.

### 6.3 Record page (relative path, same tab)

| Field | Value |
| --- | --- |
| `targetUrl` | `/lightning/r/Account/001XXXXXXXXXXXXXX/view` |
| `openInNewWindow` | `false` |

**Expected outcome:** Same-tab navigation to the Account record in the same org (origin preserved).

### 6.4 Invalid URL (javascript scheme)

| Field | Value |
| --- | --- |
| `targetUrl` | `javascript:alert(1)` |
| `openInNewWindow` | `true` or `false` |

**Expected outcome:** No navigation. Error message explains allowed patterns. **Close** dispatches `FlowNavigationFinishEvent` (design your Flow to handle this as failure or branch).

### 6.5 Missing Public URL (should not occur if Flow validates)

| Field | Value |
| --- | --- |
| `targetUrl` (Public URL) | *(blank — e.g. misconfigured API-only install)* |

**Expected outcome:** No navigation. Message states that **Public URL** is required and to set it on the screen component in Flow Builder.

---

## 7. Appendix

### 7.1 Additional notes for reviewers

| Topic | Statement |
| --- | --- |
| **Data persistence** | The component does not use Apex or DML; Flow inputs exist in browser memory for the screen lifetime only. |
| **CRUD / FLS / sharing** | Not applicable; no SOQL or object writes. |
| **Callouts / OAuth** | None. |
| **Third-party JS** | None beyond the Lightning platform and standard `lightning:*` base parts used in the template. |
| **Open redirect** | External navigation is limited to validated `http`/`https` URLs without credentials. Relative URLs are same-origin only after resolution. |

### 7.2 Known limitations

| Limitation | Implication |
| --- | --- |
| **Client-side validation only** | A malicious **admin** could still point Flow at an arbitrary allowed `https` site. Governance is org and change-set policy, not cryptographic enforcement. |
| **HTTP allowed** | Legacy `http:` URLs pass validation; use HTTPS when possible. |
| **No return to Flow after external same-tab navigation** | If `openInNewWindow` is false and the target is external, the user **leaves** Salesforce in that tab; they will not return to the Flow automatically. |
| **Single component** | No bundled Apex tests or Flow templates; samples in this doc are illustrative only. |

### 7.3 Version information (reference)

Values below mirror `sfdx-project.json` at documentation time; **reconcile before submission**.

| Version label | Subscriber Package Version Id (`04t`) |
| --- | --- |
| 0.1.0.2 | `04tQj000000Gta1IAC` |
| 0.1.0.3 | `04tQj000000Gu1RIAS` |
| 0.1.0.4 | `04tQj000000GuO1IAK` |

`versionNumber` in DX remains `0.1.0.NEXT` for the next build; bump per your release policy.

### 7.4 Release notes (high level)

| Version | Highlights |
| --- | --- |
| **0.1.0.4** | Required **Public URL** Flow input (`targetUrl`), labels and runtime messages; optional **Open in new window** unchanged. |
| **0.1.0.3** | URL validation hardening, Flow finish + deferred same-tab navigation, security-oriented metadata. |
| **Earlier builds** | See git history and Dev Hub package version list for deltas prior to 0.1.0.3. |

### 7.5 Document history

| Revision | Date | Authoring note |
| --- | --- | --- |
| 1.0 | 2026-06-04 | Initial standalone package documentation (not derived from prior security-review drafts). |
| 1.1 | 2026-06-05 | Package **0.1.0.4** / `04tQj000000GuO1IAK`; Public URL required; install URLs refreshed. |

---

*End of document.*
