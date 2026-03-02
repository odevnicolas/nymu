import { SucessoModal } from "@/components/sucesso-modal";
import { useUser } from "@/contexts/user-context";
import { changePassword, updateProfile } from "@/lib/api/auth";
import { getUserName } from "@/utils/user";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Perfil() {
  const { user, setUser } = useUser();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modal de mudar senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Estado para modal de sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
    }
  };

  const formatCPF = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  };

  // Remove todos os caracteres não numéricos do telefone
  const cleanPhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    if (user) {
      setNome(getUserName(user));
      setEmail(user.email || '');
      const cpfValue = user.cpf || '';
      setCpf(cpfValue ? formatCPF(cpfValue) : '');
      setTelefone(user.telefone || '');
      // Carregar foto se existir
      if (user.foto || user.avatar) {
        setAvatarUri(user.foto || user.avatar || null);
      }
    }
  }, [user]);

  const handlePickImage = async () => {
    try {
      // Solicitar permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setAvatarUri(asset.uri);
        
        // Se o base64 estiver disponível, usar ele
        if (asset.base64) {
          setAvatarBase64(asset.base64);
        } else {
          // Fallback: tentar converter manualmente (para web)
          try {
            const response = await fetch(asset.uri);
            const blob = await response.blob();
            const reader = new FileReader();
            
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const base64 = base64String.split(',')[1] || base64String;
              setAvatarBase64(base64);
            };
            
            reader.onerror = () => {
              console.warn('Não foi possível converter imagem para base64');
            };
            
            reader.readAsDataURL(blob);
          } catch (error) {
            console.warn('Erro ao processar imagem:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    if (!nome.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const fotoParaEnviar = avatarBase64 
        ? `data:image/jpeg;base64,${avatarBase64}` 
        : (user.foto || user.avatar || undefined);
      
      const telefoneLimpo = telefone.trim() 
        ? cleanPhone(telefone.trim()) 
        : undefined;
      
      const response = await updateProfile({
        nome: nome.trim(),
        telefone: telefoneLimpo,
        foto: fotoParaEnviar,
      });

      setUser(response.user);
      
      if (response.user.foto || response.user.avatar) {
        setAvatarUri(response.user.foto || response.user.avatar || null);
        setAvatarBase64(null);
      }

      // Mostrar modal de sucesso
      setShowSuccessModal(true);
      
      // Voltar após o modal fechar
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao atualizar perfil. Tente novamente.';
      
      console.error('Erro ao salvar:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      return;
    }

    if (newPassword.length < 6) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword(currentPassword, newPassword);
      
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Mostrar modal de sucesso
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao alterar senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            {avatarUri ? (
              <Image 
                source={{ uri: avatarUri }} 
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color="#000000" />
              </View>
            )}
            <Text style={styles.editPhotoText}>Editar Foto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulário */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Nome Completo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* E-mail */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Telefone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={(text) => setTelefone(formatPhone(text))}
              keyboardType="phone-pad"
              placeholder="(71) 99022-12394"
              placeholderTextColor="#9CA3AF"
              maxLength={15}
            />
          </View>

          {/* CPF */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={cpf}
              editable={false}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Senha */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <Text style={styles.passwordMask}>••••••</Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setShowPasswordModal(true)}
              >
                <Text style={styles.changePasswordText}>Mudar Senha</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão Salvar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Mudar Senha */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mudar Senha</Text>
              <TouchableOpacity 
                onPress={() => setShowPasswordModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Senha Atual */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Senha Atual</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    placeholder="Digite sua senha atual"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showCurrentPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nova Senha */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nova Senha</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholder="Digite a nova senha (mín. 6 caracteres)"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar Nova Senha */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Digite a nova senha novamente"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Botões do Modal */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowPasswordModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSave, isChangingPassword && styles.saveButtonDisabled]}
                onPress={handleChangePassword}
                disabled={isChangingPassword}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonSaveText}>
                  {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Sucesso */}
      <SucessoModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        titulo="Suas alterações foram salvas com sucesso."
        mensagem="Mantenha, sempre seus dados atualizados, isso é importante para toda nossa plataforma."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    backgroundColor: "#333333",
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 24,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  profileSection: {
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FAB41B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPhotoText: {
    fontSize: 14,
    fontFamily: "Urbanist_500Medium",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 24,
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
  },
  input: {
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputDisabled: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  passwordMask: {
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#1F2937",
  },
  changePasswordText: {
    fontSize: 14,
    fontFamily: "Urbanist_500Medium",
    color: "#4A90E2",
  },
  footer: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  saveButton: {
    backgroundColor: "#333333",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#FFFFFF",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  modalForm: {
    padding: 24,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#1F2937',
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  modalButtonSave: {
    backgroundColor: '#333333',
  },
  modalButtonSaveText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
});
