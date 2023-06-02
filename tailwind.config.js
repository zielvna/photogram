/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter'],
            },
            colors: {
                blue: '#0095f6',
                black: '#484848',
                gray: '#a8a8a8',
                'light-gray': '#f8f8f8',
                white: '#ffffff',
            },
            gridTemplateColumns: {
                posts: 'repeat(auto-fill, minmax(240px, 1fr))',
            },
        },
    },
    plugins: [],
};
