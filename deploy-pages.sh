#!/bin/bash
# Rebuilda e aggiorna GitHub Pages in un comando
cd /home/claude/repo
GITHUB_PAGES=1 npm run build
rm -rf /tmp/ghp && mkdir /tmp/ghp && cp -r dist/. /tmp/ghp/
cd /tmp/ghp
git init -b gh-pages
git config user.email "noreply@anthropic.com"
git config user.name "Claude"
git add -A
git -c gpg.format=openpgp -c commit.gpgsign=false commit -m "Deploy Muevo $(date +%H:%M:%S)"
git push -f "https://${GITHUB_TOKEN}@github.com/correngs-code/muevo.git" HEAD:gh-pages
echo "✓ Live su https://correngs-code.github.io/muevo/"
