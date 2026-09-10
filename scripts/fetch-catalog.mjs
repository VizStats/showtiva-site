// Rebuild data/content.json from real TMDB titles.
//
//   TMDB_API_KEY=... node scripts/fetch-catalog.mjs [--dry]
//
// The catalog shipped with Unsplash stock standing in for every poster — a
// microphone for Soul, a crowd for Vivo. This replaces all of it with real
// films and their real artwork.
//
// The curation is the point, not an afterthought. ShowTiva's promise is that
// a parent does not have to vet what their family opens, so every query here
// is filtered three ways at the source rather than trimmed afterwards:
//
//   1. Certification — US rating of PG-13 or gentler. No R, no NC-17.
//   2. Reputation — a 6.8+ average from at least 1,200 votes. The vote floor
//      matters more than the score: a 9.0 from 40 people is noise, and
//      "well vetted by the public" is exactly what a large vote count means.
//   3. Temperament — Horror, Thriller, Crime and War are excluded outright,
//      and Action is excluded everywhere except the Adventure row, where it
//      is still barred and only Adventure proper is allowed through.
//
// TMDB also gets asked to leave out anything flagged adult, though that
// overlaps with the certification filter.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const OUT = resolve(ROOT, "data/content.json");

const KEY = process.env.TMDB_API_KEY;
const DRY = process.argv.includes("--dry");

if (!KEY) {
  console.error(
    "TMDB_API_KEY is not set.\n" +
      "Get a free key at https://www.themoviedb.org/settings/api, then:\n" +
      "  TMDB_API_KEY=your_key node scripts/fetch-catalog.mjs",
  );
  process.exit(1);
}

const API = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

/* TMDB genre ids. */
const G = {
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  scifi: 878,
  thriller: 53,
  war: 10752,
  action: 28,
};

/** Never appears anywhere in the catalog, whatever the row. */
const BARRED = [G.horror, G.thriller, G.crime, G.war, G.action];

/* Shared floor. Raising the vote count is the strongest single lever on
   quality here: it filters out the obscure and the review-bombed alike. */
const FLOOR = {
  "vote_average.gte": 6.8,
  "vote_count.gte": 1200,
  certification_country: "US",
  "certification.lte": "PG-13",
  include_adult: "false",
  with_original_language: "en",
};

/**
 * One request per row, so each shelf is genuinely about what its heading
 * says rather than a slice of one big list.
 *
 * `keep` is how many titles the row wants. `pages` is how many pages to pull
 * before picking, which leaves room for the de-duplication between rows to
 * take its cut without leaving a row short.
 */
const ROWS = [
  {
    id: "shorts",
    keep: 10,
    pages: 3,
    query: { with_genres: `${G.family}|${G.animation}`, sort_by: "popularity.desc" },
  },
  {
    id: "trending-now",
    keep: 10,
    pages: 3,
    query: { sort_by: "popularity.desc", "vote_count.gte": 4000 },
  },
  {
    id: "movies",
    keep: 10,
    pages: 3,
    query: { with_genres: `${G.drama}|${G.comedy}`, sort_by: "vote_average.desc", "vote_count.gte": 3000 },
  },
  {
    id: "cartoons-animation",
    keep: 10,
    pages: 3,
    query: { with_genres: String(G.animation), sort_by: "vote_average.desc", "vote_count.gte": 2000 },
  },
  {
    id: "new-release",
    keep: 12,
    pages: 4,
    // Reputation still applies, so "new" here means recent and already well
    // received rather than merely recent.
    query: {
      sort_by: "primary_release_date.desc",
      "primary_release_date.lte": new Date().toISOString().slice(0, 10),
      "vote_count.gte": 1200,
    },
  },
  {
    id: "magical-fantasy",
    keep: 12,
    pages: 4,
    query: { with_genres: `${G.fantasy}|${G.scifi}`, sort_by: "vote_average.desc", "vote_count.gte": 2000 },
  },
  {
    id: "action-adventure",
    keep: 12,
    pages: 4,
    // Adventure without Action: Paddington rather than Bourne. The row keeps
    // its heading but not its usual temperature.
    query: { with_genres: String(G.adventure), sort_by: "vote_average.desc", "vote_count.gte": 2000 },
  },
];

async function tmdb(path, params = {}) {
  const url = new URL(API + path);
  url.searchParams.set("api_key", KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status} ${res.statusText} on ${path}`);
  return res.json();
}

async function discover({ query, pages }) {
  const out = [];
  for (let page = 1; page <= pages; page += 1) {
    const data = await tmdb("/discover/movie", {
      ...FLOOR,
      ...query,
      without_genres: BARRED.join(","),
      page,
    });
    out.push(...(data.results ?? []));
    if (page >= (data.total_pages ?? 1)) break;
  }
  return out;
}

/** "2h 8m", matching what the UI already prints. */
function runtime(minutes) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function slug(title, id) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 34);
  return base ? `${base}-${id}` : String(id);
}

async function detail(id) {
  const m = await tmdb(`/movie/${id}`, { append_to_response: "credits,videos" });

  // A title with no artwork would render as a hole in the grid, so it is
  // dropped rather than patched with a placeholder.
  if (!m.poster_path || !m.backdrop_path) return null;

  const trailer = (m.videos?.results ?? []).find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
  );

  return {
    id: slug(m.title, m.id),
    title: m.title,
    subtitle: m.tagline || null,
    type: "Movie",
    duration: runtime(m.runtime),
    rating: m.vote_average ? m.vote_average.toFixed(1) : "—",
    year: (m.release_date || "").slice(0, 4),
    description: m.overview || "",
    image: `${IMG}/w500${m.poster_path}`,
    backdrop: `${IMG}/w1280${m.backdrop_path}`,
    genres: (m.genres ?? []).map((g) => g.name),
    cast: (m.credits?.cast ?? []).slice(0, 6).map((c) => ({
      name: c.name,
      role: c.character || "",
      image: c.profile_path ? `${IMG}/w185${c.profile_path}` : null,
    })),
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
  };
}

async function main() {
  const existing = JSON.parse(await readFile(OUT, "utf8"));

  // Rows keep their identity — heading, accent, card shape, the branded flag
  // on Shorts. Only which titles they hold changes.
  const meta = new Map(existing.sections.map((s) => [s.id, s]));

  const taken = new Set();
  const movies = {};
  const sections = [];

  for (const row of ROWS) {
    const base = meta.get(row.id);
    if (!base) {
      console.warn(`skipping ${row.id}: not in the current store`);
      continue;
    }

    const candidates = await discover(row);
    const ids = [];

    for (const candidate of candidates) {
      if (ids.length >= row.keep) break;
      if (taken.has(candidate.id)) continue;

      const record = await detail(candidate.id);
      if (!record) continue;

      taken.add(candidate.id);
      movies[record.id] = record;
      ids.push(record.id);
    }

    if (ids.length < row.keep) {
      console.warn(`${row.id}: only ${ids.length}/${row.keep} passed the filters`);
    }

    sections.push({ ...base, movieIds: ids });
    console.log(`${row.id.padEnd(20)} ${ids.length} titles`);
  }

  // The banner leads with the best-reviewed things in the catalog, and each
  // needs a wide backdrop since that is what the hero paints.
  const heroSlideIds = Object.values(movies)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 4)
    .map((m) => m.id);

  const next = {
    ...existing,
    updatedAt: new Date().toISOString(),
    heroSlideIds,
    sections,
    movies,
  };

  console.log(`\n${Object.keys(movies).length} titles, ${sections.length} rows`);
  console.log(`hero: ${heroSlideIds.join(", ")}`);

  if (DRY) {
    console.log("\n--dry: nothing written");
    return;
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`\nwrote ${OUT}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
