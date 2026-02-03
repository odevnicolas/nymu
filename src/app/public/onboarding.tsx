import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ONBOARDING_DATA = [
  {
    id: '1',
    image: require('@/assets/images/welcome.png'),
    title: 'Bem-vindo\nà Nymu',
    description: 'Simplifique sua gestão financeira e foque no que realmente importa: seus pacientes.',
  },
  {
    id: '2',
    image: require('@/assets/images/welcome2.png'),
    title: 'Gerencie com\nFacilidade',
    description: 'Emita notas fiscais, acesse relatórios financeiros e otimize seu tempo.',
  },
  {
    id: '3',
    image: require('@/assets/images/welcome3.png'),
    title: 'Com você em\ncada passo',
    description: 'Simplifique sua gestão financeira e foque no que realmente importa: seus pacientes.',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/public/login');
    }
  };

  const currentItem = ONBOARDING_DATA[currentIndex];
  const lineAlignment = currentIndex === 0 ? 'flex-start' : currentIndex === 1 ? 'center' : 'flex-end';

  return (
    <View style={styles.container}>
      <View style={styles.slideContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={currentItem.image} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={[styles.yellowLineContainer, { alignItems: lineAlignment }]}>
            <View style={styles.yellowLine} />
          </View>
          <Text style={styles.title}>
            {currentItem.title}
          </Text>
          <Text style={styles.description}>
            {currentItem.description}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.nextButton}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slideContainer: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 48,
    paddingBottom: 128,
  },
  yellowLineContainer: {
    width: '100%',
    marginBottom: 24,
  },
  yellowLine: {
    width: 80,
    height: 4,
    backgroundColor: '#FDB813',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Urbanist_700Bold',
    color: '#2D3648',
    marginBottom: 16,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    width: 64,
    height: 64,
    backgroundColor: '#2D3648',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
