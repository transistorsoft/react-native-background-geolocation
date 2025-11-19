#!/usr/bin/env bash
set -euo pipefail

# Publishes generated ./docs into gh-pages/docs/<version> and pushes.
# Usage:
#   ./scripts/publish-docs.sh              # auto-detect version from branch
#   ./scripts/publish-docs.sh 5.0.0-beta   # force target folder name

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

SRC_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
TARGET_DIR="${1:-}"

if [[ -z "$TARGET_DIR" ]]; then
  case "$SRC_BRANCH" in
    master|main)
      TARGET_DIR="latest"
      ;;
    *)
      TARGET_DIR="$SRC_BRANCH"
      ;;
  esac
fi

echo "📦 Source branch: $SRC_BRANCH"
echo "📁 Target docs folder on gh-pages: docs/$TARGET_DIR"

# Ensure working tree is clean (apart from docs) before we start
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Working tree is not clean. Commit or stash your changes first."
  exit 1
fi

echo "🛠  Running pnpm run docs on $SRC_BRANCH..."
pnpm run docs

if [[ ! -d "$REPO_ROOT/docs" ]]; then
  echo "❌ docs directory not found after pnpm run docs"
  exit 1
fi

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/rnbg-docs.XXXXXX")"
echo "📂 Copying generated docs to temp: $TMP_DIR"
cp -R "$REPO_ROOT/docs/"* "$TMP_DIR/"

# Optional: clean up generated docs from the source branch
echo "🧹 Cleaning generated docs from $SRC_BRANCH working tree..."
if git ls-files --error-unmatch docs >/dev/null 2>&1; then
  git restore docs
else
  rm -rf docs
fi

echo "🔀 Switching to gh-pages..."
git checkout gh-pages

# Make sure docs root exists
mkdir -p docs

# Replace target version folder
echo "📂 Updating docs/$TARGET_DIR on gh-pages..."
rm -rf "docs/$TARGET_DIR"
mkdir -p "docs/$TARGET_DIR"
cp -R "$TMP_DIR/"* "docs/$TARGET_DIR/"

# Ensure root redirect exists (only create if missing)
if [[ ! -f docs/index.html ]]; then
  echo "➡️  Creating docs/index.html redirect to /latest/..."
  cat > docs/index.html <<'EOF'
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; URL='./latest/'" />
    <script>window.location.href = "./latest/";</script>
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to <a href="./latest/">latest docs</a>…</p>
  </body>
</html>
EOF
fi

git add docs

if git diff --cached --quiet; then
  echo "ℹ️  No changes to commit on gh-pages."
else
  COMMIT_MSG="Publish docs from $SRC_BRANCH to docs/$TARGET_DIR"
  echo "✅ Committing: $COMMIT_MSG"
  git commit -m "$COMMIT_MSG"
  echo "🚀 Pushing gh-pages..."
  git push origin gh-pages
fi

echo "🔙 Switching back to $SRC_BRANCH..."
git checkout "$SRC_BRANCH"

echo "🧹 Removing temp dir $TMP_DIR"
rm -rf "$TMP_DIR"

echo "✅ Done. Docs published to gh-pages/docs/$TARGET_DIR"
