import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: {
          navy: '#063579',
          skyBlue: '#60b5ff',
          blue: '#3b82f6',
        },
        lightGray: '#e4e4e4',
        darkGray: '#434343',
        darkNavy: '#202e48',
      },
    },
  },
  darkMode: 'class', // 다크모드: 클래스 기반 (.dark)
  plugins: [],
};

export default config;
