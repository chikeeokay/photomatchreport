# Photo Match v2

This version replaces the original square-pixel comparison with ORB local features, reciprocal descriptor matching, and RANSAC geometric verification using bundled OpenCV 4.13.0. Processing runs locally in a Web Worker. No photos are sent to a server.

## Update your existing Render app

1. Extract this ZIP.
2. Open https://github.com/chikeeokay/photomatchreport and select Add file > Upload files.
3. Drag the complete **dist** folder plus the root README, render.yaml, test report and license files into GitHub. Replace the existing files, retaining the dist folder structure.
4. Commit to **main**. Render is already configured to deploy this branch automatically.
5. Wait for Render to show Live, then refresh https://photomatchreport.onrender.com. The footer should say **Photo Match v2** and Balanced should be selected by default.

Render settings remain: Static Site; build command `true`; publish directory `dist`; root directory blank. No database, API key or paid web-service instance is required.

Upload all files together. The new files `dist/opencv.js`, `dist/matcher.js` and `dist/match-worker.js` are required. Do not upload only index.html or the ZIP itself.

## Four matching levels

| Mode | Behaviour |
|---|---|
| Strict | Requires many aligned details spread across both images; fewer automatic replacements. |
| Balanced | Recommended default for resizing, lighting changes and moderate crops. |
| Flexible | Accepts fewer verified details and less shared area. |
| Lenient | Lowest geometric evidence requirements; inspect matches carefully. |

Every mode retains geometric checks and ambiguity review. Weak evidence or competing strong uploads are flagged for review. There is no forced nearest-photo fallback. Missing photos become the requested `not found in the uploaded photos` text on export. Header/footer photos remain excluded by default. One upload can replace repeated document placements.

Change modes after scanning without repeating image analysis. Manual choices are retained. Click a photo to enlarge it; review cards show the top three candidates. Matching counts and spatial coverage are evidence measures, not probabilities of correctness. The scan can take several minutes for large batches; progress updates and Cancel remain available.

## Limits

See TEST-RESULTS.md. Tests cover transformations of the supplied photos, not newly photographed scenes. Strong viewpoint changes, repetitive surfaces, low-detail images, major construction changes or multiple very similar photos can still need manual review. Always inspect matches before exporting an inspection report. Browser interactions have not been tested end to end in this environment.

The app remains compatible with Render Free Static Sites. File capacity depends on browser memory. The bundled engine increases the initial page-engine download by about 11 MB uncompressed. Original photos and documents are not included.

## Dependencies and licenses

JSZip: JSZip-LICENSE.markdown.
OpenCV 4.13.0: OpenCV-LICENSE.txt. Bundled from https://docs.opencv.org/4.x/opencv.js; the bundled build identifies itself as 4.13.0. License source: https://github.com/opencv/opencv/blob/4.13.0/LICENSE.
