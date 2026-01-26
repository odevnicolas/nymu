/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** Urbanist como fonte principal */
    sans: 'Urbanist_400Regular',
    medium: 'Urbanist_500Medium',
    semibold: 'Urbanist_600SemiBold',
    bold: 'Urbanist_700Bold',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    /** Urbanist como fonte principal */
    sans: 'Urbanist_400Regular',
    medium: 'Urbanist_500Medium',
    semibold: 'Urbanist_600SemiBold',
    bold: 'Urbanist_700Bold',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    /** Urbanist como fonte principal */
    sans: "'Urbanist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    medium: "'Urbanist Medium', system-ui, sans-serif",
    semibold: "'Urbanist SemiBold', system-ui, sans-serif",
    bold: "'Urbanist Bold', system-ui, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
