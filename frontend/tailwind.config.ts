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
        ring: 'ring 1s ease-in-out',
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
        ring: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(15deg)' },
          '20%': { transform: 'rotate(-10deg)' },
          '30%': { transform: 'rotate(10deg)' },
          '40%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(6deg)' },
          '60%': { transform: 'rotate(-4deg)' },
          '70%': { transform: 'rotate(2deg)' },
          '80%, 100%': { transform: 'rotate(0deg)' },
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
