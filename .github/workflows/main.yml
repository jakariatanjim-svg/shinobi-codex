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

      - name: Extract project version from RELEASE_NOTES.md
        id: ver
        shell: bash
        run: |
          VERSION="unknown"
          if [ -f RELEASE_NOTES.md ]; then
            VERSION=$(grep -m1 -oE 'v[0-9]+\.[0-9]+(\.[0-9]+)?' RELEASE_NOTES.md \
              || echo "unknown")
          fi
          echo "version=${VERSION}" >> "$GITHUB_OUTPUT"
          echo "release_name=Shinobi Codex ${VERSION} — Build #${{ github.run_number }}" >> "$GITHUB_OUTPUT"

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build (Vite - single-file bundle)
        run: npm run build

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.ver.outputs.version }}-build-${{ github.run_number }}
          name: ${{ steps.ver.outputs.release_name }}
          generate_release_notes: true
          body: |
            ## ✦ ${{ steps.ver.outputs.version }}

            Download **index.html** below and upload it to Cloudflare Workers.

            - **Version:** ${{ steps.ver.outputs.version }} (from RELEASE_NOTES.md)
            - **Run:** [#${{ github.run_number }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
            - **Commit:** ${{ github.sha }} — `${{ github.event.head_commit.message }}`
          files: dist/index.html
          draft: false
          prerelease: false
