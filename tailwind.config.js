/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
    extend: {
        animation: {
            fadeIn: 'fadeIn 0.2s ease-in-out',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0', transform: 'translateY(-10px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            },
        },
    },
};
export const plugins = [];