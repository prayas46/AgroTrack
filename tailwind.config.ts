import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}', // Added lib directory
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1400px',
        '3xl': '1600px', // Added extra large screen
      },
    },
    extend: {
      fontFamily: {
        // Ensure PT Sans is loaded via @import or font loader
        sans: ['PT Sans', 'system-ui', 'sans-serif'],
        body: ['PT Sans', 'system-ui', 'sans-serif'],
        headline: ['PT Sans Narrow', 'PT Sans', 'system-ui', 'sans-serif'], // Different font for headlines
        mono: ['Roboto Mono', 'monospace'],
        code: ['Roboto Mono', 'monospace'],
      },
      colors: {
        // Base colors
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        
        // Component colors
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          50: 'hsl(var(--primary) / 0.05)',
          100: 'hsl(var(--primary) / 0.1)',
          200: 'hsl(var(--primary) / 0.2)',
          300: 'hsl(var(--primary) / 0.3)',
          400: 'hsl(var(--primary) / 0.4)',
          600: 'hsl(var(--primary) / 0.6)',
          700: 'hsl(var(--primary) / 0.7)',
          800: 'hsl(var(--primary) / 0.8)',
          900: 'hsl(var(--primary) / 0.9)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
          50: 'hsl(var(--secondary) / 0.05)',
          100: 'hsl(var(--secondary) / 0.1)',
          200: 'hsl(var(--secondary) / 0.2)',
          300: 'hsl(var(--secondary) / 0.3)',
          400: 'hsl(var(--secondary) / 0.4)',
          600: 'hsl(var(--secondary) / 0.6)',
          700: 'hsl(var(--secondary) / 0.7)',
          800: 'hsl(var(--secondary) / 0.8)',
          900: 'hsl(var(--secondary) / 0.9)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        
        // Chart colors - extended to 10 for more zones with better contrast
        chart: {
          '1': 'hsl(200 95% 55%)', // Bright Blue
          '2': 'hsl(210 90% 60%)', // Sky Blue (slightly darker for contrast)
          '3': 'hsl(190 85% 55%)', // Cyan-Blue (slightly darker)
          '4': 'hsl(220 80% 65%)', // Lavender Blue (slightly darker)
          '5': 'hsl(180 75% 48%)', // Teal Blue
          '6': 'hsl(240 80% 70%)', // Royal Blue
          '7': 'hsl(280 75% 65%)', // Purple (slightly darker)
          '8': 'hsl(320 80% 65%)', // Pink (slightly darker)
          '9': 'hsl(140 75% 50%)', // Green (slightly darker)
          '10': 'hsl(40 95% 50%)', // Orange (slightly darker)
          '11': 'hsl(0 85% 60%)', // Red (added for emergencies/errors)
          '12': 'hsl(300 80% 70%)', // Magenta (added for special categories)
        },
        
        // Sidebar colors with fallbacks
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background, var(--background)) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-foreground, var(--foreground)) / <alpha-value>)',
          primary: 'hsl(var(--sidebar-primary, var(--primary)) / <alpha-value>)',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground, var(--primary-foreground)) / <alpha-value>)',
          accent: 'hsl(var(--sidebar-accent, var(--accent)) / <alpha-value>)',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground, var(--accent-foreground)) / <alpha-value>)',
          border: 'hsl(var(--sidebar-border, var(--border)) / <alpha-value>)',
          ring: 'hsl(var(--sidebar-ring, var(--ring)) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: 'calc(var(--radius) - 6px)',
        full: '9999px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out': {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(-100%)', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
      // Additional custom utilities
      boxShadow: {
        'sidebar': '0 0 20px rgba(0, 0, 0, 0.1)',
        'chart': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      // Custom max-width
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // Custom z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // Custom opacity
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '85': '0.85',
      },
      // Custom background image
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Custom line clamp
      lineClamp: {
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
} satisfies Config;
