import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        gray: "rgb(20,20,20)",
        gray2: "rgb(30,30,30)",
        green: "rgb(0, 100, 0)",
        green2: "rgb(0, 255, 0)",
        green3: "rgb(100, 255, 100)"
      },
    },
  },
  plugins: [],
}
export default config
