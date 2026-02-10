/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },
            letterSpacing: {
                tighter: '-0.05em',
            },
            animation: {
                'wave': 'wave 2s ease-in-out infinite',
                'gradient': 'gradient 8s ease infinite',
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                wave: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(20deg)' },
                    '75%': { transform: 'rotate(-10deg)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backgroundImage: {
                'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(210, 100%, 56%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(210, 100%, 56%, 0.2) 0px, transparent 50%)',
                'mesh-gradient-dark': 'radial-gradient(at 40% 20%, hsla(210, 100%, 40%, 0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 40%, 0.15) 0px, transparent 50%)',
                'grid-pattern': 'linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
            },
            backgroundSize: {
                'mesh': '100% 100%',
                'grid': '40px 40px',
            },
        },
    },
    plugins: [],
}
