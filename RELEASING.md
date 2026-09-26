# Releasing

`react-native-background-geolocation` is published by GitHub Actions
(`.github/workflows/release.yml`) when a version tag is pushed. npm trusts that workflow
through **Trusted Publishing** (OIDC), so no npm token exists anywhere, and every release
carries **provenance**: a signed record of the repository, commit and workflow that built it.
`@transistorsoft/background-geolocation-types`, the Capacitor plugin and the Cordova plugin
release the same way.

## A release

```bash
pnpm release prepare 5.7.1   # branch chore/release-5.7.1: version, dated CHANGELOG, preflight
# merge chore/release-5.7.1 into master
pnpm release tag 5.7.1       # on master: tag the merge (lightweight, like every earlier tag)
git push origin master 5.7.1       # the tag starts the workflow
```

A release branch prepared by hand before these scripts: merge it into master (its CHANGELOG
heading back to `## Unreleased`) and delete it; `prepare` keeps the version it set, dates the
CHANGELOG and refuses a version already on npm.

The workflow checks (the tag equals `package.json`'s version; `scripts/preflight.sh --release`:
`pnpm test`, the Expo plugin build, the packed tarball's contents and what changed since the
version on npm, a strict consumer compile, a CHANGELOG heading for the version), then
publishes. What ships is decided by `.npmignore`: 5.6.0 shipped `.github/`, the tests, the
mocks and three config files, which it now excludes and preflight refuses. A prerelease such as `5.8.0-beta.1` is
published under the `beta` dist-tag, so `latest` only moves to a release.

`pnpm preflight` (without `--release`) is safe to run at any time; it publishes nothing.
Never add a `version`, `preversion` or `postversion` script: `release prepare` runs
`npm version`, which would run them.

Publishing is only the npm half. The native SDK the podspec and the Android build require
(`TSLocationManager`) must already be released, or an install fails to resolve it.

## A release that failed

Fix the cause, then re-run from the Actions tab: **release → Run workflow → Use workflow
from → Tags → the version**. The workflow refuses to run on a branch, and skips the publish
if that version is already on npm. A version can be published once, ever: if a bad tag was
pushed, delete it and release the next patch version rather than re-using the number.

## Checking a release

- The package page on npmjs.com shows a provenance badge linking to the workflow run. npm
  shows the new version as "validating" for a few minutes before it serves it.
- `npm audit signatures`, in a project that depends on the package, verifies it.

## One-time setup

On npmjs.com, the package's **Settings → Trusted Publisher → GitHub Actions**:
organization `transistorsoft`, repository `react-native-background-geolocation`, workflow
`release.yml`, environment blank (GitHub Environments are not available on this org's
plan, and the registration and the workflow must agree). **Publishing access**: "Require
two-factor authentication and disallow bypass 2fa tokens". GitHub needs nothing: no secrets,
no environment.
