#!/usr/bin/env bash
set -euo pipefail

MAIN_BRANCH="main"
DEPLOY_BRANCH="deploy"

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

REPO_ROOT="$(git rev-parse --show-toplevel)"
DIST_DIR="$REPO_ROOT/dist"

echo "Installing deps and building..."
npm ci
npm run build

if [ ! -d "$DIST_DIR" ]; then
  echo "ERROR: build did not produce $DIST_DIR"
  exit 1
fi

# Prepare a worktree for deploy branch
WORKTREE_DIR="$(mktemp -d)"
echo "Creating worktree at $WORKTREE_DIR..."
if git show-ref --verify --quiet "refs/heads/$DEPLOY_BRANCH"; then
  git worktree add "$WORKTREE_DIR" "$DEPLOY_BRANCH"
else
  git worktree add --orphan "$WORKTREE_DIR" "$DEPLOY_BRANCH"
fi

echo "Cleaning deploy worktree..."
cd "$WORKTREE_DIR"
git rm -rf . >/dev/null 2>&1 || true

echo "Copying build output from $DIST_DIR ..."
# Use dotglob so things like .nojekyll get copied too (if present)
shopt -s dotglob
cp -R "$DIST_DIR"/* .
shopt -u dotglob

# Ensure no stray folders
rm -rf dist node_modules || true

echo "Committing + pushing..."
git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
else
  git commit -m "Deploy $(date +'%Y-%m-%d %H:%M:%S')"
fi

git push -u origin "$DEPLOY_BRANCH" --force

echo "Cleaning up worktree..."
cd "$REPO_ROOT"
git worktree remove "$WORKTREE_DIR" --force
rm -rf "$WORKTREE_DIR"

echo "Done."
