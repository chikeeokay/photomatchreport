# v3.1 validation

- Ran the shipped Python build from an empty engine cache. All three public engine downloads completed, matched their pinned SHA-256 digests, and generated the static assets successfully.
- Launched the built site in Chromium with the actual four new uploads and a test DOCX containing the four corresponding images from the original document.
- Verified five options appear; Ultra lenient produces four review items, no automatic matches and no automatic missing labels.
- Every candidate received a finite region score. The correct upload appeared first for three reference photos and second for one. This is a four-upload fixture test, not a general object-recognition accuracy measurement.
- Verified export remains blocked until review is resolved; explicit replacement choice survives mode changes; marking remaining reviews missing keeps the selected replacement; resetting a missing card restores review and blocks export again.
- Replayed all 89 browser-produced v3 rankings across the original four modes: all 356 decisions were unchanged.
- Confirmed region extraction produces 25 descriptors and suggestions are ordered by region similarity in the fifth mode.

The fifth mode uses shared visual regions as suggestions, not verified object identities. Similar backgrounds can rank highly. It deliberately requires the user's decision for every previously unconfirmed image.

This package has been tested locally. It has not been deployed to the user's Render service.
