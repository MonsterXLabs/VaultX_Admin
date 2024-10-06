/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				'dark-900': '#111111',
				'dark-700': '#232323',
				'dark-600': '#3a3a3a',
				'dark-800': '#1e1e1e',
				'gray-500': '#919191',
				'gray-600': '#545454',
				'light-200': '#dee8e8',
				'yellow-400': '#ddf247',
				'white-10': 'rgba(255, 255, 255, 0.1)',
				'white-30': 'rgba(255, 255, 255, 0.3)',
				'white-50': 'rgba(255, 255, 255, 0.5)',
				'white-70': 'rgba(255, 255, 255, 0.7)',
				'white-80': 'rgba(255, 255, 255, 0.8)',
				'white-90': 'rgba(255, 255, 255, 0.9)',
			},
			zIndex: {
				'100': '100',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
