import React, { useEffect } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  animationType = 'fade',
}) => {
  // Valores animados para overlay y contenido
  const overlayOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.8);
  const contentOpacity = useSharedValue(0);
  const contentRotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animación de entrada: fade in del overlay y scale + fade del contenido
      overlayOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      
      contentScale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
        mass: 0.8,
      });
      
      contentOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      
      contentRotation.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      // Animación de salida: elegante con scale down, fade out y rotación sutil
      overlayOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
      
      contentScale.value = withTiming(0.8, {
        duration: 250,
        easing: Easing.in(Easing.back(1.2)),
      });
      
      contentOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
      
      contentRotation.value = withTiming(-5, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [visible]);

  // Estilos animados para el overlay
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  // Estilos animados para el contenido
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [
        { scale: contentScale.value },
        { rotate: `${contentRotation.value}deg` },
      ],
    };
  });

  const handleClose = () => {
    // Iniciar animación de salida
    overlayOpacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.in(Easing.ease),
    });
    
    contentScale.value = withTiming(0.8, {
      duration: 250,
      easing: Easing.in(Easing.back(1.2)),
    });
    
    contentOpacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.in(Easing.ease),
    });
    
    contentRotation.value = withTiming(-5, {
      duration: 250,
      easing: Easing.in(Easing.ease),
    });

    // Llamar onClose después de la animación
    setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Overlay animado */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
        </TouchableWithoutFeedback>

        {/* Contenido animado */}
        <Animated.View style={[styles.content, contentAnimatedStyle]} pointerEvents="box-none">
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity 
                  onPress={handleClose} 
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.childrenContainer}>
            {children}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 0,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: Colors.border.light,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
  },
  childrenContainer: {
    flexGrow: 1,
    minHeight: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  scrollableContent: {
    flexGrow: 1,
  },
});
