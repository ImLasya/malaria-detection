import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import InfectionStatus from '../components/InfectionStatus';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const ResultScreen: React.FC<Props> = ({ route }) => {
  const { image, detections, statistics } = route.params;

  if (!image || !detections || !statistics) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  const isInfected = statistics.infected_count > 0;

  const renderDetection = (detection: Props['route']['params']['detections'][0], index: number) => (
    <View key={index} style={styles.detectionItem}>
      <Text style={styles.detectionText}>
        Class: {detection.class}
      </Text>
      <Text style={styles.detectionText}>
        Confidence: {(detection.confidence * 100).toFixed(2)}%
      </Text>
      <Text style={styles.detectionText}>
        Status: {detection.infected ? 'Infected' : 'Healthy'}
      </Text>
      <Text style={styles.detectionText}>
        Position: [{detection.bbox.join(', ')}]
      </Text>
    </View>
  );

  const renderStatistics = () => (
    <View style={styles.statisticsContainer}>
      <Text style={styles.statisticsTitle}>Statistics</Text>
      <Text style={styles.statisticsText}>
        Total Cells: {statistics.total_cells}
      </Text>
      <Text style={styles.statisticsText}>
        Infected: {statistics.infected_count}
      </Text>
      <Text style={styles.statisticsText}>
        Healthy: {statistics.non_infected_count}
      </Text>
      <Text style={styles.statisticsTitle}>Class Distribution</Text>
      {Object.entries(statistics.class_counts).map(([className, count]) => (
        <Text key={className} style={styles.statisticsText}>
          {className}: {count}
        </Text>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="contain"
      />
      <InfectionStatus isInfected={isInfected} />
      {renderStatistics()}
      <Text style={styles.detectionsTitle}>Detections 🦠</Text>
      {detections.map(renderDetection)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  statisticsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  statisticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statisticsText: {
    fontSize: 16,
    marginBottom: 4,
  },
  detectionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  detectionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detectionText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ResultScreen; 