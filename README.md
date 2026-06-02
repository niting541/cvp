# cvp — Flow URL Redirect (LWC only)

This repository contains **only** the **cvp Flow URL Redirect** Lightning web component (`flowUrlRedirect`), its tests, Salesforce DX tooling, and documentation for packaging and security review.

There is **no Flow** or other Salesforce metadata in this repo; subscribers build their own Flows that use this screen component.

## Contents

| Path | Purpose |
| --- | --- |
| `force-app/main/default/lwc/flowUrlRedirect/` | LWC source and Jest tests |
| `manifest/package-cvp-urlRedirect.xml` | **Canonical** deploy manifest (this component only; includes in-file LWC documentation) |
| `docs/cvp-SECURITY_REVIEW.md` | Security review submission notes |
| `docs/README-cvp-PACKAGE.md` | Namespace, CLI deploy, 2GP pointers |

## Deploy

```bash
sf project deploy start --manifest manifest/package-cvp-urlRedirect.xml --target-org YOUR_ALIAS
npm run deploy:cvp -- --target-org YOUR_ALIAS
```

## Salesforce DX

See [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm) for project layout and CLI usage.
