# Second-generation managed package (2GP) — cvplus

Use this after your **Dev Hub** is authenticated and the **`cvplus`** namespace exists on that Dev Hub (Partner Business Org / signup flow per [Salesforce packaging docs](https://developer.salesforce.com/docs/atlas.en-us.pkg2_dev.meta/pkg2_dev/sfdx_dev_dev2gp.htm)).

This repo is wired for 2GP in `sfdx-project.json`: package alias **`cvplusUrlRedirect`** (maps to `0Ho…`), optional **`cvplusUrlRedirect@0.1.0-1`** → `04t…` after the first successful version create, path **`force-app`**, and `versionNumber` **`0.1.0.NEXT`** (CLI may adjust after versioning).

## 1. Dev Hub and default hub

```bash
sf org login web --set-default-dev-hub --instance-url https://login.salesforce.com
```

Or set the default Dev Hub in VS Code / `sf config set target-dev-hub YOUR_HUB_ALIAS`.

Confirm the org has namespace **cvplus** (Setup → Packaging / Namespace settings, per current Salesforce UI).

## 2. Create the managed package (one time)

Use the **same** logical name as the `package` field in `sfdx-project.json` (`cvplusUrlRedirect`) so the CLI output matches your alias key:

```bash
sf package create -n cvplusUrlRedirect -t Managed -r force-app ^
  -d "Flow URL Redirect LWC for Flow screens (cvplus)." ^
  -v YOUR_DEV_HUB_ALIAS
```

(On macOS/Linux, replace `^` with line continuation or put the command on one line.)

The command prints a **Subscriber Package Id** starting with **`0Ho`**. Add it to `sfdx-project.json` under **`packageAliases`**:

```json
"packageAliases": {
  "cvplusUrlRedirect": "0HoXXXXXXXXXXXXXXX"
}
```

Some CLI versions update `sfdx-project.json` for you; if they do, verify the key is **`cvplusUrlRedirect`**.

Until this entry exists, **`sf package version create`** will not resolve the package.

## 3. Create the first package version

```bash
sf package version create -p cvplusUrlRedirect -x -w 30 -v YOUR_DEV_HUB_ALIAS
```

- **`-p`** — package alias (or raw `0Ho` id).
- **`-x`** — `--installation-key-bypass` (required unless you pass `-k` with a key).

Optional: `-f config/project-scratch-def.json` if you need specific scratch features for validation (often optional for LWC-only packages).

On success you get a **Subscriber Package Version Id** (`04t…`). Install in a test org with **`sf package install`** (or the install URL from the Dev Hub UI).

## 4. Day-to-day: deploy source vs package version

| Goal | Command |
| --- | --- |
| Push metadata to an org for testing | `sf project deploy start --manifest manifest/package-cvplus-urlRedirect.xml --target-org ALIAS` |
| Cut a new **installable** 2GP version | `sf package version create -p cvplusUrlRedirect -x -w 30 -v YOUR_DEV_HUB_ALIAS` |

Bump **`versionNumber`** in `sfdx-project.json` when you move to **0.1.1.NEXT** (patch), **0.2.0.NEXT** (minor), etc., per [version numbering rules](https://developer.salesforce.com/docs/atlas.en-us.pkg2_dev.meta/pkg2_dev/sfdx_dev_dev2gp_version_number.htm).

## 5. Install a package version in another org

After `package version create` succeeds, the CLI adds an alias under `packageAliases` (for example `cvplusUrlRedirect@0.1.0-1` → `04t…`). Install in a test org:

```bash
sf package install --package 04tXXXXXXXXXXXXXXX --target-org TEST_ORG_ALIAS --wait 20
```

Use the **Subscriber Package Version Id** (`04t…`) from the command output or from `sfdx-project.json`.

## 6. AppExchange / Security Review

Submit the **package version** from the Partner Console; keep **`docs/cvplus-SECURITY_REVIEW.md`** in Git for the security questionnaire (it is not deployed as metadata).
