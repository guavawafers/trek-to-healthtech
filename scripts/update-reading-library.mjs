import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const outputPath = new URL("../data/generated-articles.json", import.meta.url);
const maxArticlesPerType = 12;
const maxAgeDays = 45;
const topicQueries = [
  "digital health design",
  "healthcare user experience",
  "healthcare AI patient experience",
  "digital health accessibility",
  "clinical workflow usability",
  "digital health equity",
];
const relevanceTerms = [
  "accessibility",
  "artificial intelligence",
  "clinical workflow",
  "digital health",
  "health ai",
  "health equity",
  "healthcare ai",
  "human-centered",
  "patient experience",
  "telehealth",
  "usability",
  "user experience",
];
const titleTerms = [
  "accessibility",
  "artificial intelligence",
  "digital health",
  "health ai",
  "health data",
  "health equity",
  "healthcare ai",
  "human-centered",
  "patient experience",
  "telehealth",
  "usability",
  "user experience",
  "workflow",
];
const healthTerms = [
  "care",
  "clinical",
  "digital health",
  "health",
  "healthcare",
  "medical",
  "patient",
];
const designTerms = [
  "accessibility",
  "adoption",
  "building",
  "design",
  "experience",
  "human-centered",
  "interface",
  "product",
  "technology",
  "usability",
  "workflow",
];

function articleId(url) {
  return `daily-${createHash("sha1").update(url).digest("hex").slice(0, 12)}`;
}

function normalizeText(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(value, maxLength = 320) {
  const text = normalizeText(value);
  return text.length > maxLength ? `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}…` : text;
}

function relevanceScore(article) {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  return relevanceTerms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
}

function titleIsRelevant(title) {
  const text = title.toLowerCase();
  return titleTerms.some((term) => text.includes(term));
}

function isHealthDesignRelevant(article) {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  return healthTerms.some((term) => text.includes(term)) && designTerms.some((term) => text.includes(term));
}

function isRecent(date) {
  const age = Date.now() - new Date(date).getTime();
  return age >= 0 && age <= maxAgeDays * 24 * 60 * 60 * 1000;
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "trek-to-healthtech-reading-library/1.0" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function fetchPubMed() {
  const query = `(${topicQueries.join(" OR ")})`;
  const today = new Date().toISOString().slice(0, 10).replaceAll("-", "/");
  const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
  searchUrl.search = new URLSearchParams({
    db: "pubmed",
    term: query,
    retmode: "json",
    retmax: "30",
    sort: "pub date",
    datetype: "pdat",
    reldate: String(maxAgeDays),
    maxdate: today,
  });
  const search = await getJson(searchUrl);
  const ids = search.esearchresult?.idlist || [];
  if (!ids.length) return [];

  const summaryUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
  summaryUrl.search = new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "json" });
  const summaries = await getJson(summaryUrl);

  return ids.map((id) => {
    const item = summaries.result[id];
    const date = new Date(item.sortpubdate || item.pubdate || Date.now());
    return {
      id: articleId(`https://pubmed.ncbi.nlm.nih.gov/${id}/`),
      type: "research",
      source: item.fulljournalname || item.source || "PubMed",
      sourceMark: "PM",
      sourceClass: "rock",
      date: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      label: "Recent research",
      readingTime: "Research paper",
      title: normalizeText(item.title),
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      summary: normalizeText(item.sortfirstauthor ? `Recent research led by ${item.sortfirstauthor}.` : "Recently published healthtech research."),
      designValue: "Review emerging evidence",
    };
  });
}

async function fetchIndustry() {
  const results = await Promise.all(topicQueries.map(async (query) => {
    const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
    url.search = new URLSearchParams({ query, tags: "story", hitsPerPage: "12" });
    const data = await getJson(url);
    return data.hits || [];
  }));

  return results.flat().filter((item) => item.url && item.title).map((item) => ({
    id: articleId(item.url),
    type: "industry",
    source: new URL(item.url).hostname.replace(/^www\./, ""),
    sourceMark: "NEW",
    sourceClass: "market-logo",
    date: item.created_at,
    label: "Recent industry read",
    readingTime: "New article",
    title: normalizeText(item.title),
    url: item.url,
    summary: "A recent industry article selected for its relevance to healthtech product design.",
    designValue: "Track emerging product signals",
  }));
}

async function fetchDevToIndustry() {
  const tags = ["healthtech", "healthcare"];
  const results = await Promise.all(tags.map((tag) => getJson(`https://dev.to/api/articles?tag=${tag}&per_page=30`)));
  return results.flat().map((item) => ({
    id: articleId(item.canonical_url || item.url),
    type: "industry",
    source: "DEV Community",
    sourceMark: "DEV",
    sourceClass: "market-logo",
    date: item.published_timestamp,
    label: "Recent industry read",
    readingTime: `${item.reading_time_minutes || 5} min read`,
    title: normalizeText(item.title),
    url: item.canonical_url || item.url,
    summary: excerpt(item.description || "A recent healthtech industry article."),
    designValue: "Track emerging product signals",
  }));
}

async function fetchCrossref() {
  const fromDate = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const untilDate = new Date().toISOString().slice(0, 10);
  const url = new URL("https://api.crossref.org/works");
  url.search = new URLSearchParams({
    query: topicQueries.join(" "),
    filter: `from-pub-date:${fromDate},until-pub-date:${untilDate},type:journal-article`,
    select: "DOI,title,published,container-title,author,URL,abstract",
    sort: "published",
    order: "desc",
    rows: "40",
  });
  const data = await getJson(url);

  return (data.message?.items || []).map((item) => {
    const dateParts = item.published?.["date-parts"]?.[0] || [];
    const date = new Date(Date.UTC(dateParts[0], (dateParts[1] || 1) - 1, dateParts[2] || 1));
    const url = item.URL || `https://doi.org/${item.DOI}`;
    const author = item.author?.[0];
    const authorName = author ? `${author.given || ""} ${author.family || ""}`.trim() : "";
    return {
      id: articleId(url),
      type: "research",
      source: item["container-title"]?.[0] || "Crossref",
      sourceMark: "CR",
      sourceClass: "future-logo",
      date: date.toISOString(),
      label: "Recent research",
      readingTime: "Research paper",
      title: normalizeText(item.title?.[0]),
      url,
      summary: excerpt(item.abstract || (authorName ? `Recent research by ${authorName}.` : "Recently published healthtech research.")),
      designValue: "Review emerging evidence",
    };
  });
}

async function existingArticles() {
  try {
    const data = JSON.parse(await readFile(outputPath, "utf8"));
    return data.articles || [];
  } catch {
    return [];
  }
}

const fetched = await Promise.allSettled([fetchPubMed(), fetchCrossref(), fetchIndustry(), fetchDevToIndustry()]);
const previous = await existingArticles();
const previousByUrl = new Map(previous.map((article) => [article.url, article]));
const addedAt = new Date().toISOString();
const fresh = fetched.flatMap((result) => result.status === "fulfilled" ? result.value : []);
const failures = fetched.filter((result) => result.status === "rejected");
failures.forEach((result) => console.warn(result.reason.message));

const candidates = [...fresh, ...previous]
  .filter((article) => article.url && article.title && isRecent(article.date))
  .map((article) => ({
    ...article,
    addedAt: previousByUrl.get(article.url)?.addedAt || addedAt,
    summary: excerpt(article.summary),
    score: relevanceScore(article),
  }))
  .filter((article) => article.score > 0 && titleIsRelevant(article.title) && isHealthDesignRelevant(article))
  .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
  .filter((article, index, all) => all.findIndex((candidate) => candidate.url === article.url) === index);

const articles = ["industry", "research"]
  .flatMap((type) => candidates.filter((article) => article.type === type).slice(0, maxArticlesPerType))
  .map(({ score, ...article }) => article);

if (!articles.length && failures.length === fetched.length) {
  throw new Error("All article sources failed and no previous generated articles are available.");
}

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ updatedAt: new Date().toISOString(), articles }, null, 2)}\n`);
const counts = Object.fromEntries(["industry", "research"].map((type) => [type, articles.filter((article) => article.type === type).length]));
console.log(`Wrote ${counts.industry} industry and ${counts.research} research articles to data/generated-articles.json`);
