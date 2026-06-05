# URL Navigator — package notes (GitHub / CI)

This repo ships a **single LWC** for Flow screens: **`flowUrlRedirect`**.

- **Product / listing name:** URL Navigator.
- **Registered namespace (2GP):** **`cvplus`** (must match `sfdx-project.json` → `"namespace": "cvplus"`).
- **Dev Hub package alias (CLI):** **`cvplus`** (matches `sfdx-project.json` → `package` and `packageAliases`).
- Manifest: **`manifest/package-url-navigator.xml`** (canonical; includes XML comments describing the LWC and deploy commands)

## Create / verify the namespace (Dev Hub)

1. In Salesforce **Setup**, register namespace **`cvplus`** on your Dev Hub (one namespace per partner context; follow current Salesforce UI).
2. Link this project: `sfdx-project.json` → `"namespace": "cvplus"` must match that org.

## Deploy source to a scratch org or sandbox (unpackaged test)

```bash
sf project deploy start --manifest manifest/package-url-navigator.xml --target-org YOUR_ALIAS
```

Or: `npm run deploy:urlNavigator`

## Create a package version (2GP outline)

1. Create a **package** (2GP) in the Dev Hub — see **`docs/README-2GP-SETUP.md`** — using package name **`cvplus`** (matches `sfdx-project.json` → `package`).
2. Add the returned **`0Ho…`** id under `packageAliases` → `"cvplus": "0Ho…"` (already present in this repo if you reuse the same Dev Hub package).
3. Run `sf package version create -p cvplus -x -w 30 -v YOUR_DEV_HUB_ALIAS`.

Use **`manifest/package-url-navigator.xml`** when you want tooling to resolve **only** this component for a promote/validate deploy.

## Security Review / AppExchange

Submit **`docs/PACKAGE_DOCUMENTATION.md`** (and the solution as packaged) through the Partner Security Review process. Keep the doc updated if you add Apex, callouts, or new surfaces later.

## Second-generation packaging (2GP)

After the Dev Hub is connected and the **cvplus** namespace is on that org, follow **[README-2GP-SETUP.md](README-2GP-SETUP.md)** to create the managed package, fill `packageAliases`, and run **`sf package version create`**.

## Current managed package reference

Latest **Subscriber Package Version Id** and install URLs are documented in **[README-2GP-SETUP.md §5](README-2GP-SETUP.md#5-install-a-package-version-in-another-org)** and in **`sfdx-project.json`** → `packageAliases` (today: **`cvplus@0.1.0-4`** → **`04tQj000000GuO1IAK`**).
