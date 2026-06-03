# cvplus — Flow URL Redirect (LWC only)

This repository contains **only** the **cvplus Flow URL Redirect** Lightning web component (`flowUrlRedirect`), its tests, Salesforce DX tooling, and documentation for packaging and security review.

There is **no Flow** or other Salesforce metadata in this repo; subscribers build their own Flows that use this screen component.

## Contents

| Path | Purpose |
| --- | --- |
| `force-app/main/default/lwc/flowUrlRedirect/` | LWC source and Jest tests |
| `manifest/package-cvplus-urlRedirect.xml` | **Canonical** deploy manifest (this component only; includes in-file LWC documentation) |
| `docs/cvplus-SECURITY_REVIEW.md` | Security review submission notes |
| `docs/README-cvplus-PACKAGE.md` | Namespace, CLI deploy, 2GP pointers |
| [`docs/README-2GP-SETUP.md`](docs/README-2GP-SETUP.md) | 2GP: package create, new versions, **current install URLs** |

## Install managed package (current build)

As of the latest repo state, **version 0.1.0.2** — Subscriber id **`04tQj000000Gta1IAC`** (see `sfdx-project.json` → `packageAliases`).

- Production: `https://login.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000Gta1IAC`
- Sandbox: `https://test.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000Gta1IAC`

## Deploy

```bash
sf project deploy start --manifest manifest/package-cvplus-urlRedirect.xml --target-org YOUR_ALIAS
npm run deploy:cvplus -- --target-org YOUR_ALIAS
```

## Salesforce DX

See [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm) for project layout and CLI usage.
