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

      - name: Prepare release info
        id: info
        shell: bash
        run: |
          VERSION="unknown"
          if [ -f RELEASE_NOTES.md ]; then
            VERSION=$(grep -m1 -oE 'v[0-9]+\.[0-9]+(\.[0-9]+)?' RELEASE_NOTES.md \
              || echo "unknown")
          fi
          REPO="${{ github.event.repository.name }}"
          TITLE=$(echo "$REPO" | tr '-' ' ' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1')
          FILE_NAME="${REPO}-${VERSION}-build-${{ github.run_number }}.html"
          echo "version=${VERSION}" >> "$GITHUB_OUTPUT"
          echo "file_name=${FILE_NAME}" >> "$GITHUB_OUTPUT"
          echo "release_name=${TITLE} ${VERSION} — Build #${{ github.run_number }}" >> "$GITHUB_OUTPUT"

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build (Vite - single-file bundle)
        run: npm run build

      - name: Name release asset
        shell: bash
        run: |
          cp dist/index.html "${{ steps.info.outputs.file_name }}"

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.info.outputs.version }}-build-${{ github.run_number }}
          name: ${{ steps.info.outputs.release_name }}
          generate_release_notes: true
          body: |
            ## ✦ ${{ steps.info.outputs.version }}

            Download **${{ steps.info.outputs.file_name }}** below and upload it to Cloudflare Workers.

            - **Version:** ${{ steps.info.outputs.version }} (from RELEASE_NOTES.md)
            - **Build file:** `${{ steps.info.outputs.file_name }}`
            - **Run:** [#${{ github.run_number }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
            - **Commit:** ${{ github.sha }} — `${{ github.event.head_commit.message }}`
          files: ${{ steps.info.outputs.file_name }}
          draft: false
          prerelease: false
