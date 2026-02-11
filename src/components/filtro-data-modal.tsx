/**
 * Modal de filtro por data com calendário
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface FiltroDataModalProps {
  visible: boolean;
  onClose: () => void;
  dataInicio: Date | null;
  dataFim: Date | null;
  onFilter: (dataInicio: Date | null, dataFim: Date | null) => void;
}

export function FiltroDataModal({
  visible,
  onClose,
  dataInicio: initialDataInicio,
  dataFim: initialDataFim,
  onFilter,
}: FiltroDataModalProps) {
  const [slideAnim] = useState(new Animated.Value(0));
  const [dataInicio, setDataInicio] = useState<Date | null>(initialDataInicio);
  const [dataFim, setDataFim] = useState<Date | null>(initialDataFim);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [selecionandoInicio, setSelecionandoInicio] = useState(true);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleFilter = () => {
    onFilter(dataInicio, dataFim);
  };

  const handleCancelar = () => {
    setDataInicio(null);
    setDataFim(null);
    onClose();
  };

  const handleDiaPress = (dia: Date) => {
    if (selecionandoInicio) {
      setDataInicio(dia);
      setSelecionandoInicio(false);
    } else {
      if (dataInicio && dia < dataInicio) {
        // Se a data fim for menor que a data início, inverte
        setDataFim(dataInicio);
        setDataInicio(dia);
      } else {
        setDataFim(dia);
      }
    }
  };

  const mesAnterior = () => {
    const novoMes = new Date(mesAtual);
    novoMes.setMonth(novoMes.getMonth() - 1);
    setMesAtual(novoMes);
  };

  const proximoMes = () => {
    const novoMes = new Date(mesAtual);
    novoMes.setMonth(novoMes.getMonth() + 1);
    setMesAtual(novoMes);
  };

  const renderCalendario = () => {
    const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
    const ultimoDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();

    const dias: (Date | null)[] = [];

    // Adiciona dias vazios antes do primeiro dia
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    // Adiciona os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia));
    }

    const isDiaNoRange = (dia: Date) => {
      if (!dataInicio || !dataFim) return false;
      return dia >= dataInicio && dia <= dataFim;
    };

    const isDiaSelecionado = (dia: Date) => {
      if (!dia) return false;
      if (dataInicio && dia.toDateString() === dataInicio.toDateString()) return true;
      if (dataFim && dia.toDateString() === dataFim.toDateString()) return true;
      return false;
    };

    return (
      <View style={styles.calendario}>
        {/* Cabeçalho do Calendário */}
        <View style={styles.calendarioHeader}>
          <TouchableOpacity onPress={mesAnterior} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          
          <Text style={styles.mesAno}>
            {mesAtual.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}
          </Text>

          <TouchableOpacity onPress={proximoMes} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Dias da Semana */}
        <View style={styles.diasSemana}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
            <Text key={dia} style={styles.diaSemanaText}>
              {dia}
            </Text>
          ))}
        </View>

        {/* Grid de Dias */}
        <View style={styles.diasGrid}>
          {dias.map((dia, index) => {
            if (!dia) {
              return <View key={`empty-${index}`} style={styles.diaVazio} />;
            }

            const selecionado = isDiaSelecionado(dia);
            const noRange = isDiaNoRange(dia);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.diaButton,
                  selecionado && styles.diaSelecionado,
                  noRange && !selecionado && styles.diaNoRange,
                ]}
                onPress={() => handleDiaPress(dia)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.diaText,
                    selecionado && styles.diaTextSelecionado,
                    noRange && !selecionado && styles.diaTextNoRange,
                  ]}
                >
                  {dia.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Filtrar por Data</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Informação de Seleção */}
              <View style={styles.selecaoInfo}>
                <Text style={styles.selecaoLabel}>
                  {selecionandoInicio ? 'Selecione a data inicial' : 'Selecione a data final'}
                </Text>
                {dataInicio && (
                  <Text style={styles.selecaoData}>
                    {dataInicio.toLocaleDateString('pt-BR')}
                    {dataFim && ` - ${dataFim.toLocaleDateString('pt-BR')}`}
                  </Text>
                )}
              </View>

              {/* Calendário */}
              {renderCalendario()}

              {/* Botões */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.cancelarButton}
                  onPress={handleCancelar}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelarText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filtrarButton, (!dataInicio || !dataFim) && styles.filtrarButtonDisabled]}
                  onPress={handleFilter}
                  activeOpacity={0.7}
                  disabled={!dataInicio || !dataFim}
                >
                  <Text style={styles.filtrarText}>Filtrar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  selecaoInfo: {
    marginBottom: 24,
    alignItems: 'center',
  },
  selecaoLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  selecaoData: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  calendario: {
    marginBottom: 24,
  },
  calendarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  mesAno: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  diasSemana: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  diaSemanaText: {
    width: (width - 48) / 7,
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
  diasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  diaVazio: {
    width: (width - 48) / 7,
    height: 44,
  },
  diaButton: {
    width: (width - 48) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  diaSelecionado: {
    backgroundColor: '#333333',
  },
  diaNoRange: {
    backgroundColor: '#F3F4F6',
  },
  diaText: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#1F2937',
  },
  diaTextSelecionado: {
    color: '#FFFFFF',
    fontFamily: 'Urbanist_700Bold',
  },
  diaTextNoRange: {
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelarButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelarText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
  },
  filtrarButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
  },
  filtrarButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  filtrarText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
});
