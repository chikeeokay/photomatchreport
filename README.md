# Photo Match for Word

A browser-based app that compares uploaded photos with embedded DOCX photos, replaces matching photos, ignores unused uploads, and replaces missing photos with the text `not found in the uploaded photos`.

Includes Strict, Balanced, Flexible and Lenient matching, manual match review, and optional TEST REPLACEMENT watermarks. Files are processed locally in the browser. No server, database, API key or installation is needed.

## Upload to GitHub

1. Extract the ZIP on your computer. Do not upload the ZIP itself as the app source.
2. Create a GitHub repository.
3. Choose **Add file > Upload files**.
4. Upload the extracted contents, including the **dist** folder, **render.yaml**, this README and the JSZip license. Keep the folder structure intact.
5. Commit the files to your default branch, usually **main**.

The repository root should contain `render.yaml` and `dist/index.html`.

## Deploy as a Render Free Static Site

1. Open https://dashboard.render.com/static/new and connect your GitHub repository.
2. Choose your default branch, usually **main**.
3. Set these values:

| Setting | Value |
| --- | --- |
| Service type | Static Site |
| Name | docx-photo-match (or another available name) |
| Root directory | Leave blank |
| Build command | true |
| Publish directory | dist |
| Environment variable | SKIP_INSTALL_DEPS = true |

4. Click **Deploy Static Site**.
5. Wait until deployment is live, then open the Render-provided `onrender.com` URL.

Alternatively, create a Render Blueprint from this repository using the included `render.yaml`. Static sites use `runtime: static`; do not select a paid Standard web-service instance.

Static hosting has no compute-instance charge; workspace bandwidth/build usage allowances still apply. Your selected DOCX/photos and generated downloads are processed in the browser rather than transferred to Render.

## Use the app

1. Select a DOCX and a batch of JPEG, PNG or WebP photos.
2. Choose match tolerance. Strict is the default; Lenient accepts a wider range.
3. Optionally enable test watermarks and header/footer matching.
4. Click **Scan and compare**.
5. Review each pair, manually resolve uncertain matches, and download the updated DOCX.

Header/footer images are preserved by default. Each photo placement is matched separately; one upload can replace repeated document occurrences. There is no configured file-size or photo-count cap; practical capacity depends on browser memory. Match review is essential, especially for Flexible/Lenient settings. The matcher compares reduced-resolution visual pixels; substantial cropping or new camera angles can require manual matching.

## Validation of the original app

Matching and export checks using the supplied 89-photo DOCX and 15 uploaded photos found all 15 uploads, replaced 15 photo placements with watermarked copies, and marked the other 74 missing. An unrelated control was ignored. Removing one upload produced 14 matches and 75 missing placements. Browser interaction was not tested end to end in the development environment.

## Files

- `dist/index.html`: user interface
- `dist/style.css`: styling
- `dist/app.js`: browser image handling and controls
- `dist/core.js`: matching and DOCX ZIP/XML updates
- `dist/jszip.min.js`: bundled JSZip dependency
- `render.yaml`: Render Static Site Blueprint

No personal photos, DOCX templates, credentials or ChatGPT Sites configuration are included. JSZip is distributed under its included license.
