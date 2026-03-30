#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ -z "${GITHUB_TOKEN:-}" && -f "${SCRIPT_DIR}/.deploy-token" ]]; then
	GITHUB_TOKEN="$(tr -d ' \n\r' < "${SCRIPT_DIR}/.deploy-token")"
fi
: "${GITHUB_TOKEN:?Set GITHUB_TOKEN or create .deploy-token (one line, gitignored)}"
REPO_HTTPS="https://${GITHUB_TOKEN}@github.com/Braintisa/Gift_Shop-Tinkerfly.git"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

ORIGIN_URL="$(git remote get-url origin)"
git remote set-url origin "$REPO_HTTPS"
git fetch origin

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/${BRANCH}")"

if [[ "$LOCAL" == "$REMOTE" ]]; then
	git remote set-url origin "$ORIGIN_URL"
	echo "No new commits on origin/${BRANCH}. Skipping pull and Docker."
	exit 0
fi

git merge --ff-only "origin/${BRANCH}"
git remote set-url origin "$ORIGIN_URL"

sudo docker compose down
sudo docker compose up -d --build

echo "Deploy finished."
