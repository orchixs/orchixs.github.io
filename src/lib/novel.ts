import { getCollection, type CollectionEntry } from 'astro:content';

export type SeriesEntry = CollectionEntry<'series'>;
export type ChapterEntry = CollectionEntry<'chapters'>;

export interface ChapterInfo {
  seriesSlug: string;
  number: number;
  title: string;
  publishedAt: Date;
  entry: ChapterEntry;
}

export interface SeriesInfo {
  slug: string;
  title: string;
  author: string;
  cover: string;
  status: string;
  synopsis: string;
  genres: string[];
  year: number | null;
  chapters: ChapterInfo[];
  totalChapters: number;
  latestChapter: number;
  updatedAt: Date;
}

let cache: Promise<SeriesInfo[]> | null = null;

async function build(): Promise<SeriesInfo[]> {
  const [seriesEntries, chapterEntries] = await Promise.all([
    getCollection('series', ({ data }) => !data.draft),
    getCollection('chapters', ({ data }) => !data.draft),
  ]);

  const bySlug = new Map<string, ChapterInfo[]>();
  for (const e of chapterEntries) {
    const slug = e.id.split('/')[0]!;
    const list = bySlug.get(slug) ?? [];
    list.push({
      seriesSlug: slug,
      number: e.data.chapter,
      title: e.data.chapterTitle ?? `Chapter ${e.data.chapter}`,
      publishedAt: e.data.publishedAt,
      entry: e,
    });
    bySlug.set(slug, list);
  }

  return seriesEntries.map((s) => {
    const slug = s.id.split('/')[0]!;
    const chapters = (bySlug.get(slug) ?? []).sort((a, b) => a.number - b.number);

    const seen = new Set<number>();
    for (const c of chapters) {
      if (seen.has(c.number)) {
        throw new Error(`[novel] Chapter ${c.number} duplikat di "${slug}"`);
      }
      seen.add(c.number);
    }

    const latest = chapters.at(-1);
    return {
      slug,
      title: s.data.title,
      author: s.data.author,
      cover: s.data.cover,
      status: s.data.status,
      synopsis: s.data.synopsis,
      genres: s.data.genres,
      year: s.data.year ?? null,
      chapters,
      totalChapters: chapters.length,
      latestChapter: latest?.number ?? 0,
      updatedAt: latest?.publishedAt ?? new Date(0),
    };
  });
}

export function getAllSeries(): Promise<SeriesInfo[]> {
  return (cache ??= build());
}

export async function getSeriesBySlug(slug: string) {
  return (await getAllSeries()).find((s) => s.slug === slug) ?? null;
}

export async function getChaptersBySeries(slug: string) {
  return (await getSeriesBySlug(slug))?.chapters ?? [];
}

export function getAdjacent(chapters: ChapterInfo[], current: number) {
  const i = chapters.findIndex((c) => c.number === current);
  return {
    prev: i > 0 ? chapters[i - 1]! : null,
    next: i >= 0 && i < chapters.length - 1 ? chapters[i + 1]! : null,
  };
}

export async function getGenres() {
  const counts = new Map<string, number>();
  for (const s of await getAllSeries()) {
    for (const g of s.genres) counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  return [...counts]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}