# cvp — package notes (GitHub / CI)

This repository is **intentionally minimal**: the **Flow URL Redirect** LWC (`flowUrlRedirect`), tests, DX config, manifests, and docs. **No Flow metadata** is shipped from this repo; subscribers add their own Flows that reference the managed screen component.

## Repository layout

- Source: `force-app/main/default/lwc/flowUrlRedirect/`
- Manifest: **`manifest/package-cvp-urlRedirect.xml`** (canonical; includes XML comments describing the LWC and deploy commands)
- Security review doc: `docs/cvp-SECURITY_REVIEW.md`

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
