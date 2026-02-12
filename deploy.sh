#!/usr/bin/env bash
set -euo pipefail

MAIN_BRANCH="main"
DEPLOY_BRANCH="deploy"

# Make sure we're in a git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1

# Ensure working tree clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: You have uncommitted changes. Commit/stash first."
  exit 1
fi

# Ensure we're on main
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]; then
  echo "Switching to $MAIN_BRANCH..."
  git checkout "$MAIN_BRANCH"
fi

echo "Installing deps (if needed) and building..."
npm ci
npm run build

# Create a temp dir with dist contents
TMP_DIR="$(mktemp -d)"
cp -R dist/* "$TMP_DIR"/

echo "Switching to $DEPLOY_BRANCH..."
if git show-ref --verify --quiet "refs/heads/$DEPLOY_BRANCH"; then
  git checkout "$DEPLOY_BRANCH"
else
  git checkout --orphan "$DEPLOY_BRANCH"
fi

echo "Cleaning deploy branch..."
git rm -rf . >/dev/null 2>&1 || true

echo "Copying build output..."
cp -R "$TMP_DIR"/* .
rm -rf "$TMP_DIR"

# Ensure no stray dist folder got copied
rm -rf dist || true
rm -rf node_modules || true

echo "Committing + pushing..."
git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
else
  git commit -m "Deploy $(date +'%Y-%m-%d %H:%M:%S')"
fi

git push -u origin "$DEPLOY_BRANCH" --force

echo "Switching back to $MAIN_BRANCH..."
git checkout "$MAIN_BRANCH"

echo "Done."
