import localFont from 'next/font/local';

export const segoeUIThis = localFont({
  src: [
    {
      // Regular (Normal, non-italic)
      path: './segoe-ui-this/segoeuithis.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      // Italic (Normal, italic)
      path: './segoe-ui-this/segoeuithisi.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      // Bold (Bold, non-italic)
      path: './segoe-ui-this/segoeuithibd.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      // Bold Italic (Bold, italic)
      path: './segoe-ui-this/segoeuithisz.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-segoe-ui-this', // Optional: to use as a CSS variable fallback
  display: 'swap',
});