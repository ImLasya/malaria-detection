import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfectionStatusProps {
  isInfected: boolean;
}

const InfectionStatus: React.FC<InfectionStatusProps> = ({ isInfected }) => {
  return (
    <View style={[styles.container, isInfected ? styles.infected : styles.healthy]}>
      <Text style={styles.text}>
        {isInfected ? 'Infected' : 'Healthy'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 16,
    alignSelf: 'center',
  },
  infected: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  healthy: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
    borderWidth: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default InfectionStatus; 