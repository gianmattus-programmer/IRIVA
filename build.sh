#!/bin/sh
set -eu
rm -rf dist
mkdir -p dist/assets
cp index.html proyecto.html styles.css styles-base.css styles-team-contact.css styles-responsive.css styles-desktop.css script.js project-viewer.css project-viewer.js dist/
cat .site-payload/part-*.b64 | base64 -d > /tmp/iriva-assets.zip
unzip -q /tmp/iriva-assets.zip -d dist/assets
