/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Theme
        'prm-primary': 'rgb(var(--prm-primary) / <alpha-value>)',
        'prm-secondary': 'rgb(var(--prm-secondary) / <alpha-value>)',
        'prm-bg': 'rgb(var(--prm-bg) / <alpha-value>)',
        'prm-fg': 'rgb(var(--prm-fg) / <alpha-value>)',
        'prm-gray': 'rgb(var(--prm-gray) / <alpha-value>)',
        'prm-error': 'rgb(var(--prm-error) / <alpha-value>)',
        'prm-success': 'rgb(var(--prm-success) / <alpha-value>)',
        'prm-warning': 'rgb(var(--prm-warning) / <alpha-value>)',
      },
      fontFamily: {
        'prm-title': ['Snowburst One', 'cursive'],
        'prm-mono': ['Overpass Mono', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
      },
      screens: {
        tall: { raw: '(min-height: 800px)' },
      },
    },
  },
};
