import localFont from 'next/font/local';
import { Gudea, Doppio_One } from 'next/font/google';

export const gudea = Gudea({
  weight: ['400', '700'], // Regular and Bold
  style: ['normal', 'italic'], // Normal and Italic
  display: 'swap',
  subsets: ['latin']
});

export const doppioOne = Doppio_One({
  weight: '400', // Regular
  style: 'normal', // Normal
  display: 'swap',
  subsets: ['latin']
});



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