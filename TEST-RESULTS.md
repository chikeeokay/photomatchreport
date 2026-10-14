# Photo Match v2 test results

Tested 14 October 2026 using the same OpenCV JavaScript matcher shipped in the app.

Original input: 89 document placements and 15 uploaded photos. Balanced produced 15 correct replacements and 74 missing results. No extra document placements were automatically matched.

Each transformation batch contained all 15 source photos, compared against all 15 altered candidates.

| Transformation | Strict correct / review | Balanced correct / review | Flexible correct / review | Lenient correct / review | Wrong automatic matches |
|---|---:|---:|---:|---:|---:|
| resize | 15 / 0 | 15 / 0 | 15 / 0 | 15 / 0 | 0 |
| crop | 13 / 2 | 15 / 0 | 15 / 0 | 15 / 0 | 0 |
| brightness | 15 / 0 | 15 / 0 | 15 / 0 | 15 / 0 | 0 |
| rotation | 15 / 0 | 15 / 0 | 15 / 0 | 15 / 0 | 0 |
| watermark | 15 / 0 | 15 / 0 | 15 / 0 | 15 / 0 | 0 |

Transformations: 600-pixel JPEG at quality 65; cropped to 75% of original width/height; brightness 1.25 and saturation 0.7; rotation 12 degrees; bottom watermark covering 8% of height.

Worker initialization, extraction, ranking and duplicate-upload ambiguity checks passed in a Node worker adapter. All four modes sent identical competing uploads to review. JavaScript syntax checks passed. These are algorithm/worker checks, not an end-to-end browser test.

These results are limited to the supplied photos and these transformations. They do not establish universal accuracy or reliability for genuinely different camera viewpoints.
