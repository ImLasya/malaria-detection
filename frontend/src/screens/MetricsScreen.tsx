import React from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const metrics = {
  accuracy: 0.93,
  precision: 0.95,
  recall: 0.92,
  f1Score: 0.94,
  mAP50: 0.94,
  mAP5095: 0.89,
  valBoxLoss: 0.12,
  valClsLoss: 0.08,
  valDflLoss: 0.15,
};

const chartData = {
  labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
  datasets: [
    {
      data: [0.85, 0.88, 0.91, 0.93, 0.95],
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [0.82, 0.85, 0.88, 0.90, 0.92],
      color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [0.80, 0.85, 0.89, 0.92, 0.94],
      color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ['Accuracy', 'Precision', 'F1 Score'],
};

const lossData = {
  labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
  datasets: [
    {
      data: [0.25, 0.20, 0.18, 0.15, 0.12],
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [0.15, 0.12, 0.10, 0.09, 0.08],
      color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [0.30, 0.25, 0.20, 0.17, 0.15],
      color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ['Box Loss', 'Class Loss', 'DFL Loss'],
};

const screenWidth = Dimensions.get('window').width;

const MetricsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Model Metrics 📊</Text>
        <Text style={styles.subtitle}>YOLO Model Performance Analysis</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#007AFF',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loss Metrics</Text>
        <LineChart
          data={lossData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#007AFF',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Accuracy</Text>
            <Text style={styles.metricValue}>{metrics.accuracy.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Precision</Text>
            <Text style={styles.metricValue}>{metrics.precision.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Recall</Text>
            <Text style={styles.metricValue}>{metrics.recall.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>F1 Score</Text>
            <Text style={styles.metricValue}>{metrics.f1Score.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>mAP@50</Text>
            <Text style={styles.metricValue}>{metrics.mAP50.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>mAP@50-95</Text>
            <Text style={styles.metricValue}>{metrics.mAP5095.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Box Loss</Text>
            <Text style={styles.metricValue}>{metrics.valBoxLoss.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Class Loss</Text>
            <Text style={styles.metricValue}>{metrics.valClsLoss.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>DFL Loss</Text>
            <Text style={styles.metricValue}>{metrics.valDflLoss.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  section: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default MetricsScreen; 