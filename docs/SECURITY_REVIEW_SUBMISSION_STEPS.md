# URL Navigator — Security Review submission steps

Use this checklist in order. **Salesforce Partner UI labels change over time**; if a step does not match your console, use Partner Help or your PAM and keep the same intent (submit the correct **package version** and documentation).

**Current submission build (update when you ship a new version):**

| Item | Value |
| --- | --- |
| Package version for review | **0.1.0.4** |
| Subscriber Package Version Id (`04t`) | `04tQj000000GuO1IAK` |
| Subscriber Package Id (`0Ho`) | `0HoQj000000021pKAA` |
| Namespace | `cvplus` |
| Technical doc | [`docs/PACKAGE_DOCUMENTATION.md`](PACKAGE_DOCUMENTATION.md) |
| Questionnaire (draft answers) | [`docs/SECURITY_REVIEW_QUESTIONNAIRE.md`](SECURITY_REVIEW_QUESTIONNAIRE.md) |

Confirm ids in **`sfdx-project.json`** → `packageAliases` before you submit.

---

## Phase A — Before you open the Security Review

1. **Freeze the build**  
   Decide that **`04tQj000000GuO1IAK`** (or newer) is the version reviewers will install. Avoid changing source after submit unless you plan a new version and resubmit.

2. **Verify in a clean org**  
   - Install using production or sandbox install URL (see [`README.md`](../README.md) or [`PACKAGE_DOCUMENTATION.md`](PACKAGE_DOCUMENTATION.md) §1.3).  
   - Create a **Screen Flow** that uses **URL Navigator — Flow URL Redirect** (`cvplus__flowUrlRedirect`).  
   - Set **Public URL** (required) and test **Open in new window** true/false.  
   - Confirm redirect and error paths behave as documented.

3. **Repository**  
   - Ensure GitHub (or your SCM) matches the submitted package source.  
   - Tag the commit that matches the submitted `04t` (optional but helpful): e.g. `v0.1.0.4`.

4. **Documents ready**  
   - [`docs/PACKAGE_DOCUMENTATION.md`](PACKAGE_DOCUMENTATION.md) — technical + reviewer appendix.  
   - [`docs/SECURITY_REVIEW_QUESTIONNAIRE.md`](SECURITY_REVIEW_QUESTIONNAIRE.md) — fill any blanks, then attach or paste as required.  
   - Export to **PDF** if the submission portal asks for PDFs.

5. **AppExchange listing (if required for your path)**  
   - Many flows require a **draft or published listing** tied to the solution before or during Security Review.  
   - In **Salesforce Partner Community**, open your **AppExchange / Publishing** area and ensure the listing exists and describes **URL Navigator** accurately.

---

## Phase B — Open and complete the Security Review request

6. **Sign in** to [Salesforce Partner Community](https://partners.salesforce.com) with a user who can manage your solution / packages.

7. **Navigate to Security Review**  
   Go to the area where you **request a Security Review** for your managed package (often under **Publishing**, **Solutions**, or **Security** — exact path depends on your program and UI version).

8. **Start (or continue) a review**  
   - Select the **managed package** / solution that corresponds to **URL Navigator** (`cvplus` namespace, package id `0HoQj000000021pKAA`).  
   - When asked for the **package version to review**, provide **`04tQj000000GuO1IAK`** (or your newer `04t`).

9. **Upload or link documentation**  
   - Attach **`docs/PACKAGE_DOCUMENTATION.md`** (or PDF).  
   - Attach completed **`docs/SECURITY_REVIEW_QUESTIONNAIRE.md`** (or PDF).  
   - Add **install instructions**: production URL  
     `https://login.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK`  
     and sandbox URL  
     `https://test.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK`  
     plus a one-line note: *Install in a sandbox; create a Screen Flow using the component; set Public URL.*

10. **Complete the web questionnaire**  
    Use the Partner portal form. For each question, copy or adapt answers from [`SECURITY_REVIEW_QUESTIONNAIRE.md`](SECURITY_REVIEW_QUESTIONNAIRE.md). Do not claim Apex, APIs, or storage you do not implement.

11. **Submit**  
    Submit the review request. Save any **case number**, **email confirmation**, or **portal link** for follow-up.

---

## Phase C — After submission

12. **Monitor email and Partner cases**  
    Respond to clarifications quickly. Some findings are automated (e.g. scanner); others are manual questions.

13. **If revisions are required**  
    - Implement fixes in source.  
    - Run `sf package version create -p cvplus -x -w 60 -v YOUR_DEV_HUB_ALIAS` (see [`README-2GP-SETUP.md`](README-2GP-SETUP.md)).  
    - Update **`sfdx-project.json`**, **`PACKAGE_DOCUMENTATION.md`**, **`SECURITY_REVIEW_QUESTIONNAIRE.md`**, and this file with the **new `04t`**.  
    - Resubmit or attach the new version per Salesforce instructions.

14. **If approved**  
    - Store the approval record with your release process.  
    - Keep documentation updated for each future package version you ship.

---

## Quick reference — install URLs for reviewers

| Environment | URL |
| --- | --- |
| Production | `https://login.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK` |
| Sandbox | `https://test.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK` |

---

## Document history

| Version | Date | Notes |
| --- | --- | --- |
| 1.0 | 2026-06-05 | Initial submission steps for URL Navigator / cvplus 2GP |
