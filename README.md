# URL Navigator — Flow URL Redirect (LWC only)

This repository contains **only** the **URL Navigator** Flow URL Redirect Lightning web component (`flowUrlRedirect`), Salesforce DX tooling, and documentation for **2GP** packaging and security review.

**Registered namespace (2GP):** **`cvplus`**. **Product / AppExchange name:** **URL Navigator**. `sfdx-project.json` uses `"name": "URL Navigator"` and `"namespace": "cvplus"`.

There is **no Flow** or other Salesforce metadata in this repo; subscribers build their own Flows that use this screen component.

## Contents

| Path | Purpose |
| --- | --- |
| `force-app/main/default/lwc/flowUrlRedirect/` | LWC source |
| `manifest/package-url-navigator.xml` | **Canonical** deploy manifest (this component only) |
| `docs/PACKAGE_DOCUMENTATION.md` | **Canonical** package, component, configuration, examples, and reviewer appendix |
| `docs/README-url-navigator-PACKAGE.md` | Namespace, CLI deploy, 2GP pointers |
| [`docs/README-2GP-SETUP.md`](docs/README-2GP-SETUP.md) | 2GP: package create, new versions, install URLs |

## Install managed package (current build)

As of the latest repo state, **version 0.1.0.3** — Subscriber id **`04tQj000000Gu1RIAS`** (see `sfdx-project.json` → `packageAliases`).

- Production: `https://login.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000Gu1RIAS`
- Sandbox: `https://test.salesforce.com/packaging/installPackage.apexp?p0=04tQj000000Gu1RIAS`

## Deploy (unpackaged)

```bash
sf project deploy start --manifest manifest/package-url-navigator.xml --target-org YOUR_ALIAS
npm run deploy:urlNavigator -- --target-org YOUR_ALIAS
```

## Salesforce DX

See [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm) for project layout and CLI usage.
