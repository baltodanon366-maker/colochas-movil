import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../constants/colors';

interface MainLayoutProps {
  children: ReactNode;
  style?: any;
  showHeader?: boolean;
  headerTitle?: string;
  headerRight?: ReactNode;
  onHeaderBack?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  style,
  showHeader = false,
  headerTitle,
  headerRight,
  onHeaderBack,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {showHeader && headerTitle && (
        <View style={styles.header}>
          {onHeaderBack && (
            <View style={styles.headerLeft}>
              {/* Header se maneja con el componente Header */}
            </View>
          )}
        </View>
      )}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
