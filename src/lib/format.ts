const TZ = 'Asia/Jakarta';

const long = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TZ,
});

const short = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: TZ,
});

export function formatDate(date: Date): string {
  return long.format(date);
}

export function formatDateShort(date: Date): string {
  return short.format(date);
}

/** "slice-of-life" -> "Slice Of Life" */
export function genreLabel(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}