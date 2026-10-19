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
  { label: 'Genre',     href: '/genre/' },
  // disable { label: 'Blog',      href: '/blog/' },
] as const;

export const PER_PAGE = 12;

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