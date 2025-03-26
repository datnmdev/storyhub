import type { Config } from 'tailwindcss';

export default {
  content: ['./**/*.{html,js,jsx,ts,tsx}', '!./node_modules'],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in forwards',
        fadeOut: 'fadeOut 0.5s ease-out forwards',
        blink:
          'fadeOut 1s linear infinite alternate, fadeIn 1s linear infinite alternate',
        expandWidth: 'expandWidth 1s ease-in-out',
        shrinkWidth: 'shrinkWidth 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        expandWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        shrinkWidth: {
          '0%': { width: '100%', opacity: '1' },
          '100%': { width: '0', opacity: '0' },
        },
      },
    },
    screens: {
      mobile: '0em',
      tablet: '46.25em',
      desktop: '64em',
    },
  },
  plugins: [],
} satisfies Config;
