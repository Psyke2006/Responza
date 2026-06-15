import { Platform } from 'react-native';

const tintColorLight = '#E22D2D';
const tintColorDark = '#E22D2D';

export const Colors = {
  light: {
    background: '#F8E1E1',       // Light pink background matching Figma screens
    primary: '#000000',          // Black primary buttons
    primaryText: '#FFFFFF',      // White text for primary buttons
    text: '#000000',             // Black text for headers and input values
    textSecondary: '#555555',    // Dark grey text for subtitles
    link: '#1F41BB',             // Blue color for links like "Forgot Password ?"
    cardBackground: '#FFFFFF',   // White background for cards and inputs
    border: '#000000',           // Thin black border for inputs and cards
    accent: '#E22D2D',           // Red accent for logo and icons
    placeholder: '#8E8E93',      // Grey placeholder text
    greyLight: '#F2F2F7',        // Light grey helper color
    
    // Default system values to satisfy template components
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Keep it identical to light theme as the app's visual style is explicitly light pink
    background: '#F8E1E1',
    primary: '#000000',
    primaryText: '#FFFFFF',
    text: '#000000',
    textSecondary: '#555555',
    link: '#1F41BB',
    cardBackground: '#FFFFFF',
    border: '#000000',
    accent: '#E22D2D',
    placeholder: '#8E8E93',
    greyLight: '#F2F2F7',
    
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
