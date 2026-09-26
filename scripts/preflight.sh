#!/usr/bin/env bash
# Everything worth checking before a release — run by scripts/release.sh and by the
# release workflow, and safe to run any time.
#
#   scripts/preflight.sh             tests, build, pack, and compile a consumer against the tarball
#   scripts/preflight.sh --release   also: CHANGELOG has a heading for this version
#
# The tests run the module against mocks; what they cannot see is the tarball, shaped by
# .npmignore alone (5.6.0 shipped .github/, tests/, tests-types/, mocks/ and three config
# files), and the Expo plugin, built into a gitignored expo/plugin/build/ that app.plugin.js
# requires. Builds nothing it keeps, publishes nothing; it reads the registry only to
# compare file lists.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
RELEASE=0
[ "${1:-}" = "--release" ] && RELEASE=1

GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; DIM=$'\033[2m'; RESET=$'\033[0m'
ok()   { echo "  ${GREEN}✓${RESET} $1"; }
fail() { echo "  ${RED}✗${RESET} $1" >&2; exit 1; }
step() { echo; echo "${DIM}── $1${RESET}"; }

cd "$ROOT"
NAME="$(node -p "require('./package.json').name")"
VERSION="$(node -p "require('./package.json').version")"

step "1. version"
echo "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$' || fail "package.json version '$VERSION' is not semver"
if [ "$RELEASE" = 1 ]; then
  # The first `## ` heading must be this version: an `## Unreleased` above it means the
  # notes were never given a version.
  first="$(grep -m1 '^## ' CHANGELOG.md || true)"
  case "$first" in
    "## $VERSION "*) ok "$NAME@$VERSION — CHANGELOG: $first" ;;
    *) fail "CHANGELOG's first heading is '$first', not '## $VERSION …' — run pnpm release prepare" ;;
  esac
else
  ok "$NAME@$VERSION"
fi

step "2. tests and build"
pnpm -s test >"$WORK/test.log" 2>&1 || { cat "$WORK/test.log" >&2; fail "pnpm test (jest, and the typings under tests-types)"; }
ok "pnpm test — $(grep -m1 '^Tests:' "$WORK/test.log" | sed 's/^Tests: *//')"
pnpm -s run build >"$WORK/build.log" 2>&1 || { cat "$WORK/build.log" >&2; fail "pnpm run build (the Expo plugin)"; }
ok "expo/plugin/build rebuilt"

step "3. the tarball"
npm pack --silent --pack-destination "$WORK" >/dev/null || fail "npm pack"
TARBALL="$(ls "$WORK"/*.tgz)"
tar -tzf "$TARBALL" | sort > "$WORK/contents"
# What a React Native app needs: the module and its typings, the Expo config plugin and the
# build app.plugin.js loads, and the native halves.
for want in package/package.json package/src/index.js package/src/index.d.ts package/app.plugin.js \
            package/expo/plugin/build/index.js package/RNBackgroundGeolocation.podspec \
            package/android/build.gradle; do
  grep -qx "$want" "$WORK/contents" || fail "the tarball has no $want"
done
grep -q '^package/android/src/' "$WORK/contents" || fail "the tarball has no android/src/"
grep -q '^package/ios/' "$WORK/contents" || fail "the tarball has no ios/"
bad="$(grep -E '^package/(\.github|tests|tests-types|mocks|scripts|example|docs|help|bin|node_modules|expo/plugin/src)/|/\.gradle/|^package/(jest\.config\.js|babel\.config\.js|typedoc\.json|RELEASING\.md)$' "$WORK/contents" || true)"
[ -z "$bad" ] || fail "the tarball carries what it should not (.npmignore): $(echo "$bad" | head -3 | tr '\n' ' ')"
ok "$(basename "$TARBALL") — $(wc -l < "$WORK/contents" | tr -d ' ') files"
# Against the version on npm now: files that vanish or appear are worth a look before
# they ship. Printed, not enforced — a deliberate change is fine.
PREV="$(npm view "$NAME" dist-tags.latest 2>/dev/null || true)"
if [ -n "$PREV" ] && (cd "$WORK" && npm pack --silent "$NAME@$PREV" >/dev/null 2>&1); then
  tar -tzf "$WORK"/*-"$PREV".tgz | sort > "$WORK/previous"
  gone="$(comm -23 "$WORK/previous" "$WORK/contents" | sed 's#^package/##')"
  new="$(comm -13 "$WORK/previous" "$WORK/contents" | sed 's#^package/##')"
  ok "against $PREV on npm: $(echo -n "$gone" | grep -c . || true) gone, $(echo -n "$new" | grep -c . || true) new"
  [ -z "$gone" ] || echo "$gone" | head -12 | sed 's/^/      - /'
  [ -z "$new" ] || echo "$new" | head -12 | sed 's/^/      + /'
else
  echo "  ${DIM}(no published version to compare with)${RESET}"
fi

step "4. a consumer compiles against it"
# The typings import only the types package (a dependency), so no react-native is needed to
# compile; the module itself requires react-native at runtime, which is the tests' job.
mkdir -p "$WORK/consumer" && cd "$WORK/consumer"
echo '{"name": "consumer", "private": true}' > package.json
npm install --silent --no-audit --no-fund "$TARBALL" >/dev/null || fail "npm install of the tarball"
cat > index.ts <<'TS'
import BackgroundGeolocation from "react-native-background-geolocation";
import type { Config, Location, State, Subscription } from "react-native-background-geolocation";

const config: Config = {
  geolocation: { desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High, distanceFilter: 10 },
  logger: { logLevel: BackgroundGeolocation.LogLevel.Verbose },
};
export async function start(): Promise<boolean> {
  const state: State = await BackgroundGeolocation.ready(config);
  const sub: Subscription = BackgroundGeolocation.onLocation((location: Location) => location.coords.latitude);
  sub.remove();
  return state.enabled;
}
TS
for mode in "node16 node16" "esnext bundler"; do
  set -- $mode
  "$ROOT/node_modules/.bin/tsc" --strict --noEmit --skipLibCheck false --target es2020 --lib es2020,dom \
    --module "$1" --moduleResolution "$2" index.ts \
    || fail "a strict consumer does not compile under moduleResolution $2"
done
ok "strict TypeScript compiles under node16 and bundler resolution"

echo
echo "${GREEN}preflight passed${RESET} — $NAME@$VERSION"
