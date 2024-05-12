/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'prm-bg': 'rgb(var(--prm-bg) / <alpha-value>)',
        'prm-primary': 'rgb(var(--prm-primary) / <alpha-value>)',
        'prm-secondary': 'rgb(var(--prm-secondary) / <alpha-value>)',
      },
    },
  },
};
