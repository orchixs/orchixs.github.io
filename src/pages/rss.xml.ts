import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, URLS } from '~/constants';
import { getAllSeries, type ChapterInfo, type SeriesInfo } from '~/lib/novel';

function chapterHeading(series: SeriesInfo, chapter: ChapterInfo): string {
  const custom = chapter.title !== `Chapter ${chapter.number}` ? chapter.title : null;
  return custom
    ? `${series.title} — Chapter ${chapter.number}: ${custom}`
    : `${series.title} — Chapter ${chapter.number}`;
}

export async function GET(context: APIContext) {
  const all = await getAllSeries();

  const items = all
    .flatMap((series) =>
      series.chapters.map((chapter) => ({
        title: chapterHeading(series, chapter),
        link: URLS.novelChapter(series.slug, chapter.number),
        pubDate: chapter.publishedAt,
        description: `Chapter ${chapter.number} dari ${series.title}.`,
        categories: ['Novel', series.status, ...series.genres],
      })),
    )
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50);

  return rss({
    title: `${SITE.name} — Chapter Baru`,
    description: SITE.description,
    site: context.site!,
    items,
    customData: `<language>id-ID</language>`,
  });
}