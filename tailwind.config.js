/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
		  colors: {
			main: 'var(--main)',
			overlay: 'var(--overlay)',
			bg: 'var(--bg)',
			bw: 'var(--bw)',
			blank: 'var(--blank)',
			text: 'var(--text)',
			mtext: 'var(--mtext)',
			border: 'var(--border)',
			ring: 'var(--ring)',
			ringOffset: 'var(--ring-offset)',
			
			secondaryBlack: '#212121', 
		  },
		  borderRadius: {
			base: '16px'
		  },
		  boxShadow: {
			shadow: 'var(--shadow)'
		  },
		  translate: {
			boxShadowX: '1px',
			boxShadowY: '2px',
			reverseBoxShadowX: '-1px',
			reverseBoxShadowY: '-2px',
		  },
		  fontWeight: {
			base: '500',
			heading: '700',
		  },
		},
	  },
	plugins: [],
};