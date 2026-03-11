/**
 * ErrorBoundary - Componente para tratamento de erros
 * 
 * Captura erros React e exibe uma UI amigável
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDimensions } from '@/hooks/use-dimensions';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  const { spacing, fontSize } = useDimensions();

  return (
    <View style={[styles.fallbackContainer, { padding: spacing.lg }]}>
      <Text style={[styles.errorTitle, { fontSize: fontSize.lg }]}>
        Algo deu errado
      </Text>
      <Text style={[styles.errorMessage, { fontSize: fontSize.sm }]}>
        {error.message || 'Ocorreu um erro inesperado'}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg }]}
        onPress={resetError}
        accessibilityLabel="Tentar novamente"
        accessibilityHint="Pressione para tentar carregar novamente"
        accessibilityRole="button"
      >
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error!}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  errorTitle: {
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 16,
  },
});

export default ErrorBoundary;
