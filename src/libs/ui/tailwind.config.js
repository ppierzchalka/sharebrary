/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './.storybook/**/*.{js,jsx,ts,tsx}'],
  // This will use the root project's tailwind config
  presets: [require('../../../tailwind.config.js')],
};
