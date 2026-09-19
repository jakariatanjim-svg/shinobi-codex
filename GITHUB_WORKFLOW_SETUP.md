name: Build & Release

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-and-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build (Vite - single-file bundle)
        run: npm run build

      - name: Generate tag
        id: tag
        run: echo "tag=v3.5-$(date +'%Y-%m-%d-%H%M')" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.tag.outputs.tag }}
          name: "Shinobi Codex v3.5 — Build ${{ steps.tag.outputs.tag }}"
          body: |
            ## ✦ Shinobi Codex v3.5
            
            **Download `dist/index.html`** below and upload to Cloudflare Workers.
            
            - **Commit:** ${{ github.sha }}
            - **Built:** ${{ steps.tag.outputs.tag }}
          files: dist/index.html
          draft: false
          prerelease: false
