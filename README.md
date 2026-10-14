# Photo Match v3.1 — small GitHub upload

This ZIP contains code, not the large engine files. Render downloads and verifies the engine during the build. Photos still stay in your browser; the app remains a Free Static Site. No API key or backend is needed.

## Update your existing site

1. Extract this ZIP. Open the extracted folder.
2. In GitHub, open `chikeeokay/photomatchreport` → Add file → Upload files.
3. Upload the **contents**, including `build.py`, `engine-sources.json`, `render.yaml`, and the entire `dist` folder. Do not upload the ZIP itself. Commit the changes.
4. Open your Render service → Settings → Build & Deploy. Set **Build Command** to `python3 build.py` (replace the old `true`). Keep **Publish Directory** as `dist` and Root Directory blank. Keep `SKIP_INSTALL_DEPS=true` if already configured.
5. Save, then use Manual Deploy → Deploy latest commit if a new build did not start. Wait for the deployment to finish. Refresh and check that the footer says **Photo Match v3.1**.

An existing service's settings are not necessarily updated by uploading render.yaml. You must change the Build Command in step 4. If an automatic deployment ran before that change, deploy the latest commit again afterwards.

Old v3 engine `.bin` files or `opencv.js` in GitHub do not block this update, but can be removed later. Keep all small files supplied in this package. The build overwrites the generated engine manifest and chunks. Do not include your DOCX or photos in the repository.

## Fifth option: Ultra lenient — object review

Use this when a photo has changed angle or only part of the same object is visible. The model compares 25 smaller regions, in addition to the existing whole-scene descriptors. Suggestions are sorted by strongest region similarity, without requiring the whole scene to match or the candidate to prefer only one document photo.

This is visual similarity, not an object detector or proof of object identity. Trees, sky, walls and other backgrounds can look similar. Every unconfirmed photo goes to review: **this mode never automatically accepts a replacement or rejects a photo based on its score**. The three strongest suggestions are visible; all uploads remain available in the dropdown. Choose the replacement you want, or mark it not found. After selecting your desired replacements, “Mark all remaining reviews as not found” resolves the rest. Export remains blocked while any review is unresolved.

Manual choices survive mode changes. Use “Use automatic suggestion” on a card to reset its choice. Strict, Balanced, Flexible and Lenient retain their previous rules. The existing watermark option and DOCX export are retained.

## Build and privacy

Build command: `python3 build.py`. Standard-library Python only; no pip/npm install required. Model revision and SHA-256 digests are pinned in engine-sources.json. Downloads are verified before publication and downloaded from their original public sources. A failed download fails the build rather than publishing incomplete engine files.

The browser still downloads about 47 MB on first use. Scanning many photos can take several minutes. The smaller GitHub package fixes upload size, not browser model size. Region descriptors reuse an existing model pass; they do not require extra model downloads or passes.

The model, OpenCV, ONNX Runtime and JSZip license texts are included. DINOv2-small model: https://huggingface.co/Xenova/dinov2-small. OpenCV 4.13.0; ONNX Runtime Web 1.20.1.
