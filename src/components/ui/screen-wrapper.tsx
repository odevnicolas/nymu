/**
 * Componente ScreenWrapper - Wrapper responsivo para telas
 * 
 * Fornece padding, scroll e tratamento de teclado padronizados
 */

import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useDimensions } from '@/hooks/use-dimensions';

interface ScreenWrapperProps {
  children: ReactNode;
  /** Se a tela deve ter scroll */
  scrollable?: boolean;
  /** Se deve evitar o teclado */
  keyboardAvoiding?: boolean;
  /** Estilos adicionais para o container */
  style?: StyleProp<ViewStyle>;
  /** Estilos adicionais para o conteúdo */
  contentStyle?: StyleProp<ViewStyle>;
  /** Padding horizontal personalizado */
  horizontalPadding?: number;
  /** Padding vertical personalizado */
  verticalPadding?: number;
  /** Se deve mostrar o StatusBar */
  showStatusBar?: boolean;
  /** Cor de fundo */
  backgroundColor?: string;
}

export function ScreenWrapper({
  children,
  scrollable = true,
  keyboardAvoiding = true,
  style,
  contentStyle,
  horizontalPadding,
  verticalPadding,
  showStatusBar = true,
  backgroundColor = '#FFFFFF',
}: ScreenWrapperProps) {
  const { spacing } = useDimensions();

  const horizontal = horizontalPadding ?? spacing.md;
  const vertical = verticalPadding ?? spacing.md;

  const content = (
    <View
      style={[
        styles.content,
        { paddingHorizontal: horizontal, paddingVertical: vertical },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const Container = keyboardAvoiding ? KeyboardAvoidingView : View;
  const containerBehavior = keyboardAvoiding
    ? Platform.OS === 'ios'
      ? 'padding'
      : 'height'
    : undefined;

  return (
    <Container
      behavior={containerBehavior}
      style={[styles.container, { backgroundColor }, style]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      {showStatusBar && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={backgroundColor}
        />
      )}
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
