# Trek to Healthtech

## Daily Reading Library Updates

The Reading Library combines hand-curated articles in `reading-library.html` with a generated daily feed in `data/generated-articles.json`.

GitHub Actions runs `.github/workflows/update-reading-library.yml` every day at 15:17 UTC. It collects recent healthtech product-design articles from structured public APIs, filters and deduplicates them, then commits changes to the generated feed.

Run the updater locally:

```bash
node scripts/update-reading-library.mjs
```

The updater keeps up to 12 relevant Industry Reads and 12 Research & Evidence articles published within the last 45 days. Each category has its own capacity so one cannot crowd out the other. Existing curated articles are never modified.

Each generated article keeps its original `addedAt` timestamp across daily updates. The Reading Library displays this date and labels articles as **New** for 30 days after they first enter the library.
