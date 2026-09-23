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
          echo "zip_name=${{ github.event.repository.name }}-${VERSION}-pages.zip" >> "$GITHUB_OUTPUT"
          echo "release_name=Shinobi Codex ${VERSION} — Build #${{ github.run_number }}" >> "$GITHUB_OUTPUT"

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Package dist for Cloudflare Pages
        shell: bash
        run: |
          cd dist
          zip -r "../${{ steps.ver.outputs.zip_name }}" . -x '.*'
          cd ..
          unzip -l "${{ steps.ver.outputs.zip_name }}"

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.ver.outputs.version }}-build-${{ github.run_number }}
          name: ${{ steps.ver.outputs.release_name }}
          generate_release_notes: true
          body: |
            ## ✦ ${{ steps.ver.outputs.version }}

            **Cloudflare Pages deploy:** download **${{ steps.ver.outputs.zip_name }}** and drag it
            into Cloudflare Pages → *Create/Upload assets*. The archive contains the `dist` output
            directly (index.html, _redirects, _headers, manifest, icon), so no folder nesting.

            **Single-file preview:** `index.html` is also attached for quick local viewing.

            - **Version:** ${{ steps.ver.outputs.version }} (from RELEASE_NOTES.md)
            - **Run:** [#${{ github.run_number }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
            - **Commit:** ${{ github.sha }} — `${{ github.event.head_commit.message }}`
          files: |
            ${{ steps.ver.outputs.zip_name }}
            dist/index.html
          draft: false
          prerelease: false
