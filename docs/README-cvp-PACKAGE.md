# cvp — separate package (GitHub / CI)

This repo can hold **multiple deployment slices**. The **cvp AppExchange** slice is the **Flow URL Redirect** LWC only (no Flow metadata in the package manifest).

## What to push to GitHub

You can use **one repository** with:

- Source: `force-app/main/default/lwc/flowUrlRedirect/`
- Narrow manifest: `manifest/package-cvp-urlRedirect.xml`
- Security review doc: `docs/cvp-SECURITY_REVIEW.md`

Alternatively, create a **dedicated GitHub repository** and copy only those paths plus `sfdx-project.json`, `package.json`, and `jest.config.js` if you want a minimal repo for this app.

## Create / verify the namespace (Dev Hub)

1. In Salesforce **Setup**, register namespace **`cvp`** on your Dev Hub (one namespace per partner context; follow current Salesforce UI).
2. In your **packaging** project, set the namespace on the org used to create the managed package (Salesforce documents this as part of **2GP**/**1GP** packaging workflows).

## Deploy for validation (CLI)

From the project root (adjust username / org alias):

```bash
sf project deploy start --manifest manifest/package-cvp-urlRedirect.xml --target-org YOUR_ALIAS
```

## Create a package version (2GP outline)

Exact flags depend on your Dev Hub and package creation flow. Typical steps:

1. Create a **package** (2GP) in the Dev Hub that tracks the metadata you need.
2. Ensure the package directory includes `flowUrlRedirect` (this repo: under `force-app`).
3. Run `sf package version create` (or your CI equivalent) referencing the correct package id.

Use **`manifest/package-cvp-urlRedirect.xml`** when you want tooling to resolve **only** this component for a promote/validate deploy, or align your **package** definition in the Dev Hub to the same members.

## Security review artifact

Submit **`docs/cvp-SECURITY_REVIEW.md`** (and the solution as packaged) through the Partner Security Review process. Keep the doc updated if you add Apex, callouts, or new surfaces later.
