import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { EstadisticaNumero } from '../../../services/historial.service';

interface NumeroGridProps {
  numeros: EstadisticaNumero[];
  onNumeroPress: (numero: number) => void;
}

export const NumeroGrid: React.FC<NumeroGridProps> = ({ numeros, onNumeroPress }) => {
  return (
    <View style={styles.container}>
      {numeros.map((numero) => (
        <TouchableOpacity
          key={numero.numero}
          onPress={() => {
            if (numero.vendido) {
              onNumeroPress(numero.numero);
            }
          }}
          activeOpacity={0.7}
          style={styles.item}
        >
          <View
            style={[
              styles.badge,
              numero.vendido ? styles.badgeVendido : styles.badgeNoVendido,
            ]}
          >
            <Text style={styles.text}>{numero.numero.toString().padStart(2, '0')}</Text>
            {numero.vendido && (
              <View style={styles.indicator}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.secondary} />
              </View>
            )}
          </View>
          {numero.vendido && <Text style={styles.stats}>{numero.vecesVendido}x</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  item: {
    width: '11%',
    minWidth: 60,
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
  },
  badgeVendido: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  badgeNoVendido: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.medium,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  indicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.background.primary,
    borderRadius: 10,
  },
  stats: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginTop: 4,
    fontWeight: '600',
  },
});

