/**
 * Hook para dimensões de tela responsivas
 * 
 * Fornece dimensões dinâmicas baseadas no tamanho da tela
 * para garantir que o app seja responsivo em diferentes dispositivos.
 */

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Breakpoints para diferentes tamanhos de dispositivo
 */
export const BREAKPOINTS = {
  /** smartphones pequenos */
  xs: 320,
  /** smartphones normais */
  sm: 375,
  /** smartphones grandes / tablets pequenos */
  md: 414,
  /** tablets */
  lg: 768,
  /** tablets grandes / laptops */
  xl: 1024,
};

/**
 * Escalas baseadas no tamanho da tela
 * Permite criar dimensões proporcionais
 */
export const SCALES = {
  /** Escala pequena (para dispositivos pequenos) */
  small: SCREEN_WIDTH < BREAKPOINTS.sm ? 0.8 : 1,
  /** Escala normal */
  normal: 1,
  /** Escala média (para dispositivos grandes) */
  medium: SCREEN_WIDTH > BREAKPOINTS.md ? 1.1 : 1,
  /** Escala grande (para tablets) */
  large: SCREEN_WIDTH >= BREAKPOINTS.lg ? 1.2 : 1,
};

/**
 * Objeto com常用的 dimensões e utilitários
 */
export interface UseDimensionsResult {
  /** Largura da tela */
  width: number;
  /** Altura da tela */
  height: number;
  /** Se é dispositivo pequeno */
  isSmall: boolean;
  /** Se é tablet */
  isTablet: boolean;
  /** Orientação portrait */
  isPortrait: boolean;
  /** Orientação landscape */
  isLandscape: boolean;
  /** Escala atual baseada no tamanho */
  scale: number;
  /** Breakpoint atual */
  breakpoint: keyof typeof BREAKPOINTS;
  /** Função para gerar valor responsivo */
  responsive: <T>(values: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }) => T;
  /** Espaçamento responsivo */
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** Border radius responsivo */
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** Tamanho de fonte responsivo */
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

/**
 * Hook principal para dimensões
 */
export function useDimensions(): UseDimensionsResult {
  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription.remove();
  }, []);

  const { width, height } = dimensions;
  const isPortrait = height > width;
  const isLandscape = !isPortrait;
  const isSmall = width < BREAKPOINTS.sm;
  const isTablet = width >= BREAKPOINTS.lg;

  // Determinar escala baseada no tamanho
  const getScale = (): number => {
    if (width < BREAKPOINTS.xs) return 0.75;
    if (width < BREAKPOINTS.sm) return 0.85;
    if (width < BREAKPOINTS.md) return 0.95;
    if (width < BREAKPOINTS.lg) return 1;
    if (width < BREAKPOINTS.xl) return 1.1;
    return 1.2;
  };

  const scale = getScale();

  // Determinar breakpoint atual
  const getBreakpoint = (): keyof typeof BREAKPOINTS => {
    if (width < BREAKPOINTS.sm) return 'xs';
    if (width < BREAKPOINTS.md) return 'sm';
    if (width < BREAKPOINTS.lg) return 'md';
    if (width < BREAKPOINTS.xl) return 'lg';
    return 'xl';
  };

  /**
   * Função para obter valor responsivo baseado no tamanho da tela
   */
  const responsive = <T,>(values: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }): T => {
    const breakpoint = getBreakpoint();
    
    if (breakpoint === 'xl' && values.xl !== undefined) return values.xl;
    if (breakpoint === 'lg' && values.lg !== undefined) return values.lg;
    if (breakpoint === 'md' && values.md !== undefined) return values.md;
    if (breakpoint === 'sm' && values.sm !== undefined) return values.sm;
    if (values.xs !== undefined) return values.xs;
    
    // Retorna o primeiro valor disponível
    return values.md ?? values.sm ?? values.xs ?? ({} as T);
  };

  // Espaçamento responsivo
  const baseSpacing = 4 * scale;
  const spacing = {
    xs: baseSpacing,
    sm: baseSpacing * 2,
    md: baseSpacing * 3,
    lg: baseSpacing * 4,
    xl: baseSpacing * 6,
  };

  // Border radius responsivo
  const baseRadius = 4 * scale;
  const borderRadius = {
    sm: baseRadius,
    md: baseRadius * 2,
    lg: baseRadius * 3,
    xl: baseRadius * 4,
  };

  // Tamanho de fonte responsivo
  const baseFontSize = 14 * scale;
  const fontSize = {
    xs: Math.round(baseFontSize * 0.75),
    sm: Math.round(baseFontSize * 0.85),
    md: Math.round(baseFontSize),
    lg: Math.round(baseFontSize * 1.15),
    xl: Math.round(baseFontSize * 1.35),
    xxl: Math.round(baseFontSize * 1.5),
  };

  return {
    width,
    height,
    isSmall,
    isTablet,
    isPortrait,
    isLandscape,
    scale,
    breakpoint: getBreakpoint(),
    responsive,
    spacing,
    borderRadius,
    fontSize,
  };
}

/**
 * Hook simplificado para apenas largura e altura
 */
export function useScreenDimensions() {
  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription.remove();
  }, []);

  return dimensions;
}

/**
 * Hook para responder a mudanças de orientação
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    SCREEN_HEIGHT > SCREEN_WIDTH ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.height > window.width ? 'portrait' : 'landscape');
    });

    return () => subscription.remove();
  }, []);

  return orientation;
}

/**
 * Normaliza um valor baseado na escala da tela
 * @param value - Valor em pixels base (para tela de 375px de largura)
 */
export function normalize(value: number): number {
  const scale = SCREEN_WIDTH / 375;
  return Math.round(value * scale);
}

/**
 * Funções helper para dimensões comuns
 */
export const dimensions = {
  /** Largura da tela */
  screenWidth: SCREEN_WIDTH,
  /** Altura da tela */
  screenHeight: SCREEN_HEIGHT,
  /** Largura do conteúdo (com padding horizontal) */
  contentWidth: SCREEN_WIDTH - 32,
  /** Altura do header padrão */
  headerHeight: 56,
  /** Altura do tabbar padrão */
  tabBarHeight: 60,
  /** Largura mínima para touch targets (accessibilidade) */
  minTouchTarget: 44,
};
