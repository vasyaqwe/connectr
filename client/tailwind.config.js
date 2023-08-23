/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        container: {
            padding: {
                DEFAULT: "1rem",
                "2xl": "6rem",
            },
        },
        fontFamily: {
            primary: ["DM Sans", "sans-serif"],
        },
        extend: {
            colors: {
                primary: {
                    400: "#334fa3",
                },
                secondary: {
                    100: "#ecf0f8",
                    400: "#c2cfe9",
                    900: "#05080e",
                },
                neutral: {
                    400: "#faf9fb",
                    450: "#edeced",
                    500: "hsl(222, 8%, 85%)",
                    600: "#dbdbe0",
                    700: "#bbbec5",
                    800: "#8a8c92",
                    900: "#050810",
                },
                danger: {
                    50: "#ffe1db",
                    100: "#ff9797",
                    400: "#f56363",
                    500: "hsl(0, 80%, 58%)",
                    900: "#4d2325",
                },
                accent: {
                    50: "#eeedff",
                    100: "#e6e8f7",
                    300: "#9ba4df",
                    400: "#3753aa",
                },
            },
        },
    },
    plugins: [],
}
