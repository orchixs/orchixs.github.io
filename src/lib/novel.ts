import { getCollection, type CollectionEntry } from 'astro:content';

export type NovelEntry = CollectionEntry<'novel'>;

export interface SeriesInfo {
  slug: string;
  title: string;
  author: string;
  cover: string;
  status: string;
  synopsis: string;
  genres: string[];
  year: number | null;
  totalChapters: number;
  latestChapter: number;
  updatedAt: Date;
  entry: NovelEntry;
}

export interface ChapterInfo {
  seriesSlug: string;
  number: number;
  title: string;
  publishedAt: Date | null;
  entry: NovelEntry;
}

function parseSlug(id: string): string {
  return id.split('/')[0]!;
}

export async function getAllSeries(): Promise<SeriesInfo[]> {
  const [seriesEntries, chapterEntries] = await Promise.all([
    getCollection('novel', ({ data }) => data.type === 'series'),
    getCollection('novel', ({ data }) => data.type === 'chapter'),
  ]);

  const chaptersBySlug = new Map<string, ChapterInfo[]>();
  for (const ch of chapterEntries) {
    const slug = parseSlug(ch.id);
    const list = chaptersBySlug.get(slug) ?? [];
    list.push({
      seriesSlug: slug,
      number: ch.data.chapter ?? 0,
      title: ch.data.chapterTitle ?? `Chapter ${ch.data.chapter ?? 0}`,
      publishedAt: ch.data.publishedAt ?? null,
      entry: ch,
    });
    chaptersBySlug.set(slug, list);
  }

  return seriesEntries.map((entry) => {
    const slug = parseSlug(entry.id);
    const chapters = (chaptersBySlug.get(slug) ?? []).sort((a, b) => a.number - b.number);
    const latest = chapters.length > 0 ? chapters[chapters.length - 1]! : null;

    return {
      slug,
      title: entry.data.title ?? slug,
      author: entry.data.author ?? 'Unknown',
      cover: entry.data.cover ?? '',
      status: entry.data.status ?? 'Ongoing',
      synopsis: entry.data.synopsis ?? '',
      genres: entry.data.genres ?? [],
      year: entry.data.year ?? null,
      totalChapters: chapters.length,
      latestChapter: latest?.number ?? 0,
      updatedAt: latest?.publishedAt ?? new Date(0),
      entry,
    };
  });
}

export async function getSeriesBySlug(slug: string): Promise<SeriesInfo | null> {
  const all = await getAllSeries();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getChaptersBySeries(slug: string): Promise<ChapterInfo[]> {
  const chapters = await getCollection('novel', ({ data }) => data.type === 'chapter');
  const list: ChapterInfo[] = [];

  for (const ch of chapters) {
    if (parseSlug(ch.id) !== slug) continue;
    list.push({
      seriesSlug: slug,
      number: ch.data.chapter ?? 0,
      title: ch.data.chapterTitle ?? `Chapter ${ch.data.chapter ?? 0}`,
      publishedAt: ch.data.publishedAt ?? null,
      entry: ch,
    });
  }

  return list.sort((a, b) => a.number - b.number);
}

export async function getChapterEntry(
  seriesSlug: string,
  chapterNum: number,
): Promise<ChapterInfo | null> {
  const list = await getChaptersBySeries(seriesSlug);
  return list.find((c) => c.number === chapterNum) ?? null;
}

export function prevChapter(list: ChapterInfo[], current: number): ChapterInfo | null {
  const idx = list.findIndex((c) => c.number === current);
  return idx > 0 ? list[idx - 1]! : null;
}

export function nextChapter(list: ChapterInfo[], current: number): ChapterInfo | null {
  const idx = list.findIndex((c) => c.number === current);
  return idx >= 0 && idx < list.length - 1 ? list[idx + 1]! : null;
}