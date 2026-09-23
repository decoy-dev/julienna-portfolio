#!/usr/bin/env bash
# Lighthouse on every page of a running preview server, mobile preset, GPU disabled (the perf bar is
# "> 80 on mobile without hardware acceleration"; the site currently scores 99-100).
# Usage: npx astro build && npx astro preview --port 4322 --host 127.0.0.1 &   then   scripts/qa/lighthouse.sh
# CHROME_PATH must point at a Chrome/Chromium binary (on the original machine: Chrome for Testing
# from Playwright's cache, see docs/handoff/HANDOFF.md).
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:4322/julienna-portfolio}"
for p in "" work/ contact/ brand/; do
  n=${p%/}; n=${n:-home}
  npx -y lighthouse@13 "$BASE/$p" --quiet --chrome-flags="--headless=new --disable-gpu" \
    --output=json --output-path="/tmp/lh-$n.json" --only-categories=performance,accessibility,best-practices,seo >/dev/null 2>&1
  jq -r --arg n "$n" '[$n, (.categories|to_entries|map("\(.key)=\(.value.score*100|floor)")|join(" ")), "CLS=\(.audits["cumulative-layout-shift"].numericValue)", "TBT=\(.audits["total-blocking-time"].numericValue)"]|join("  ")' "/tmp/lh-$n.json"
done
