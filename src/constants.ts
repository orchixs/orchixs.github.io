export const SITE = {
  name: 'Yukionovel',
  title: 'Baca Light Novel dan Web Novel Bahasa Indonesia',
  description: 'Koleksi Light Novel dan Web Novel Bahasa Indonesia.',
  url: 'https://orchixs.github.io',
  // url: 'https://yukionime.web.id',
  locale: 'id-ID',
  lang: 'id',
  ogImage: '/og.jpg' as string,
} as const;

export const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  // { label: 'Anime',     href: '/anime/' },
  { label: 'Novel',     href: '/novel/' },
  { label: 'Genre',     href: '/genre/' },
  // disable { label: 'Blog',      href: '/blog/' },
] as const;

export const NOVEL_STATUSES = [
  'Ongoing', 
  'Completed', 
  'Hiatus', 
  'Dropped'
] as const;
export type NovelStatus = typeof NOVEL_STATUSES[number];

export const STATUS_VARIANT: Record<NovelStatus, 'success' | 'accent' | 'warning' | 'default'> = {
  'Ongoing':   'success',
  'Completed': 'accent',
  'Hiatus':    'warning',
  'Dropped':   'default',
};

export const URLS = {
  novel:        (slug: string) => `/novel/${slug}/`,
  novelChapter: (slug: string, chapter: number) => `/novel/${slug}/${chapter}/`,
} as const;

export const BREAKPOINTS = {
  tablet:  '48rem',
  desktop: '56rem',
} as const;

export const ADS = {
  showPlaceholder: import.meta.env.DEV,
  slots: {
    homeInline: '',
    animeDetailInline: '',
    animeDetailSidebar: '',
    watchBelowPlayer: '',
  },
} as const;