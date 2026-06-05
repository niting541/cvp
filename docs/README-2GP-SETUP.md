# Second-generation managed package (2GP) — URL Navigator (namespace cvplus)

**Product name:** URL Navigator. **Registered namespace on the Dev Hub:** **`cvplus`** (component API prefix `cvplus__` in managed subscriber orgs).

Use this after your **Dev Hub** is authenticated and the **`cvplus`** namespace exists on that Dev Hub (Partner Business Org / signup flow per [Salesforce packaging docs](https://developer.salesforce.com/docs/atlas.en-us.pkg2_dev.meta/pkg2_dev/sfdx_dev_dev2gp.htm)).

This repo is wired for 2GP in `sfdx-project.json`: package alias **`cvplus`** → **`0HoQj000000021pKAA`**, latest version alias **`cvplus@0.1.0-4`** → **`04tQj000000GuO1IAK`** (version **0.1.0.4**), path **`force-app`**, and `versionNumber` **`0.1.0.NEXT`** for the next build.

## 1. Dev Hub and default hub

```bash
sf org login web --set-default-dev-hub --instance-url https://login.salesforce.com
```

Or set the default Dev Hub in VS Code / `sf config set target-dev-hub YOUR_HUB_ALIAS`.

Confirm the org has namespace **cvplus** (Setup → Packaging / Namespace settings, per current Salesforce UI).

## 2. Create the managed package (one time)

Use the **same** logical name as the `package` field in `sfdx-project.json` (`cvplus`) so the CLI output matches your alias key:

```bash
sf package create -n cvplus -t Managed -r force-app ^
  -d "URL Navigator — Flow screen redirect LWC (validated URLs)." ^
  -v YOUR_DEV_HUB_ALIAS
```

(On macOS/Linux, replace `^` with line continuation or put the command on one line.)

The command prints a **Subscriber Package Id** starting with **`0Ho`**. Add it to `sfdx-project.json` under **`packageAliases`**:

```json
"packageAliases": {
  "cvplus": "0HoXXXXXXXXXXXXXXX"
}
```

Some CLI versions update `sfdx-project.json` for you; if they do, verify the key is **`cvplus`**.

Until this entry exists, **`sf package version create`** will not resolve the package.

### 2a. Change the package name shown in Setup (e.g. replace `cvplusUrlRedirect`)

The **Installed Packages** page shows the **package name from the Dev Hub package record**, not from `sfdx-project.json`. To rename it (for example to **URL Navigator**), run against your **Dev Hub**:

```bash
sf package update -p cvplus -n "URL Navigator" -d "Your short description." -v YOUR_DEV_HUB_ALIAS
```

Use `-p` with your alias (`cvplus`) or the Subscriber Package Id (`0Ho…`). Subscriber orgs typically show the new name after the next **package upgrade** (or reinstall); open **Installed Packages** again after upgrading.

## 3. Create a package version

```bash
sf package version create -p cvplus -x -w 30 -v YOUR_DEV_HUB_ALIAS
```

- **`-p`** — package alias (or raw `0Ho` id).
- **`-x`** — `--installation-key-bypass` (required unless you pass `-k` with a key).

Optional: `-f config/project-scratch-def.json` if you need specific scratch features for validation (often optional for LWC-only packages).

On success you get a **Subscriber Package Version Id** (`04t…`). The CLI usually appends an alias like **`cvplus@0.1.0-N`** to `packageAliases` in `sfdx-project.json`.

## 4. Day-to-day: deploy source vs package version

| Goal | Command |
| --- | --- |
| Push metadata to an org for testing | `sf project deploy start --manifest manifest/package-url-navigator.xml --target-org ALIAS` |
| Cut a new **installable** 2GP version | `sf package version create -p cvplus -x -w 30 -v YOUR_DEV_HUB_ALIAS` |

Bump **`versionNumber`** in `sfdx-project.json` when you move to **0.1.1.NEXT** (patch), **0.2.0.NEXT** (minor), etc., per [version numbering rules](https://developer.salesforce.com/docs/atlas.en-us.pkg2_dev.meta/pkg2_dev/sfdx_dev_dev2gp_version_number.htm).

## 5. Install a package version in another org

After `package version create` succeeds, use the newest **`cvplus@0.1.0-N`** entry in `packageAliases` (today: **`cvplus@0.1.0-4`** → **`04tQj000000GuO1IAK`**).

**Production install URL** (log in to the target org first):

`https://login.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK`

**Sandbox install URL:**

`https://test.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000GuO1IAK`

CLI:

```bash
sf package install --package 04tQj000000GuO1IAK --target-org TEST_ORG_ALIAS --wait 20
```

Replace the `04t` id when you publish a newer package version.

## 6. AppExchange / Security Review

Submit the **package version** from the Partner Console. Use:

- **[`docs/SECURITY_REVIEW_SUBMISSION_STEPS.md`](SECURITY_REVIEW_SUBMISSION_STEPS.md)** — step-by-step submission checklist  
- **[`docs/SECURITY_REVIEW_QUESTIONNAIRE.md`](SECURITY_REVIEW_QUESTIONNAIRE.md)** — draft answers for the questionnaire  
- **[`docs/PACKAGE_DOCUMENTATION.md`](PACKAGE_DOCUMENTATION.md)** — technical reference (not deployed as metadata)
