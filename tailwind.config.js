/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        custom: {
          primary: {
            1: "rgb(249, 177, 84)",
            2: "rgb(234, 84, 124)",
            3: "rgb(109, 86, 160)",
            4: "rgb(74, 193, 224)",
            5: "rgb(79, 185, 168)",
          },
          secondary: {
            1: "rgb(241, 135, 33)",
            2: "rgb(174, 24, 87)",
            3: "rgb(72, 39, 120)",
            4: "rgb(0, 172, 216)",
            5: "rgb(0, 152, 119)",
          },
          black: "rgb(60, 60, 59)",
          gray: "rgb(112, 111, 111)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: { 
        arciform: ["Arciform", "sans-serif"], 
        poppins: ["Poppins", "sans-serif"]
      },
      spacing: {
        "navbar-height": "4rem",
        "-navbar-height": "calc(100vh - 4rem)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
