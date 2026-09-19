import { ThemeConfig } from './types';

/**
 * Dawosti Design System & Theme Configuration
 * Traditional Nepali elegance blended with contemporary luxury.
 */
export const themeConfig: ThemeConfig = {
  name: 'Dawosti Royal Heritage',
  colors: {
    primary: '#8B3A3A',        // Primary Maroon (Nepali Royal Crimson / Sindoor / Rhododendron)
    primaryHover: '#722E2E',
    primaryDark: '#561F1F',
    accent: '#D4AF37',         // Metallic Gold (Nepali Temple Brass & Gold Embroidery)
    accentHover: '#BFA030',
    accentLight: '#F3E5AB',
    creamBackground: '#FFF8F0', // Warm Himalayan Raw Silk Cream
    surface: '#FFFFFF',
    surfaceMuted: '#FAF2E9',
    textPrimary: '#2B1810',    // Deep Charcoal Umber
    textSecondary: '#6B564C',  // Warm Muted Soil
    border: '#EADCCE',        // Subtle Raw Silk Border
  },
  typography: {
    fontFamilySerif: '"Marcellus", "Cinzel", "Playfair Display", Georgia, serif',
    fontFamilySans: '"Plus Jakarta Sans", "Noto Sans Devanagari", system-ui, sans-serif',
    fontFamilyDevanagari: '"Noto Sans Devanagari", system-ui, sans-serif',
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
};

export default themeConfig;
