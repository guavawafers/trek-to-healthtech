# Trek to Healthtech

## Daily Reading Library Updates

The Reading Library combines hand-curated articles in `reading-library.html` with a generated daily feed in `data/generated-articles.json`.

GitHub Actions runs `.github/workflows/update-reading-library.yml` every day at 15:17 UTC. It collects recent healthtech product-design articles from structured public APIs, filters and deduplicates them, then commits changes to the generated feed.

Run the updater locally:

```bash
node scripts/update-reading-library.mjs
```

The updater keeps at most 24 relevant articles published within the last 45 days. Existing curated articles are never modified.
