import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        // Ensure PT Sans is loaded via @import or font loader
        sans: ['PT Sans', 'system-ui', 'sans-serif'],
        body: ['PT Sans', 'system-ui', 'sans-serif'],
        headline: ['PT Sans', 'system-ui', 'sans-serif'],
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
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
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
        
        // Chart colors - extended to 10 for more zones
        chart: {
          '1': 'hsl(200 95% 55%)', // Bright Blue
          '2': 'hsl(210 90% 65%)', // Sky Blue
          '3': 'hsl(190 85% 60%)', // Cyan-Blue
          '4': 'hsl(220 80% 70%)', // Lavender Blue
          '5': 'hsl(180 75% 50%)', // Teal Blue
          '6': 'hsl(240 80% 75%)', // Royal Blue
          '7': 'hsl(280 75% 70%)', // Purple
          '8': 'hsl(320 80% 70%)', // Pink
          '9': 'hsl(140 75% 55%)', // Green
          '10': 'hsl(40 95% 55%)', // Orange
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
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-out',
      },
      // Additional custom utilities
      boxShadow: {
        'sidebar': '0 0 20px rgba(0, 0, 0, 0.1)',
        'chart': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
