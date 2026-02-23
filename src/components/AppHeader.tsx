import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';

interface AppHeaderProps {
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ rightIcon, onRightPress }) => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const handleLogoPress = () => {
    if ((navigation as any).openDrawer) {
      (navigation as any).navigate('Ventas', { categoria: 'diaria' });
    } else {
      navigation.navigate('MainDrawer', { screen: 'Ventas', params: { categoria: 'diaria' } });
    }
  };

  const handleMenuPress = () => {
    if ((navigation as any).openDrawer) {
      (navigation as any).openDrawer();
    } else {
      navigation.navigate('MainDrawer', { screen: 'DrawerMenu' } as any);
    }
  };

  const handleProfilePress = () => {
    // Navegar a la pantalla de perfil
    navigation.navigate('Perfil');
  };

  return (
    <LinearGradient
      colors={Colors.gradients.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleMenuPress}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color={Colors.text.inverse} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogoPress}
          style={styles.logoContainer}
          activeOpacity={0.7}
        >
          <Ionicons name="cash" size={28} color={Colors.secondary} />
          <Text style={styles.logoText}>LEYSTEFF</Text>
        </TouchableOpacity>

        <View style={styles.rightContainer}>
          {rightIcon && onRightPress && (
            <TouchableOpacity 
              onPress={onRightPress}
              style={styles.rightButton}
              activeOpacity={0.7}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={handleProfilePress}
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle" size={32} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    shadowColor: Colors.shadow.color,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
    elevation: 4,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
    marginRight: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    letterSpacing: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightButton: {
    padding: 4,
  },
  profileButton: {
    padding: 4,
  },
});

