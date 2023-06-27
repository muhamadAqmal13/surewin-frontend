/** @type {import('tailwindcss').Config} */

module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: "#FF4500",
                secondary: "#FF8C00",
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
            },
            boxShadow: {
                custom: "0 0 5px 1px rgba(0, 0, 0, 0.25)",
                input: "0 0 5px 1px rgba(52, 211, 153, 0.5)",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
