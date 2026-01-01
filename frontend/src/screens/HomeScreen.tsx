import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

const metrics = {
  precision: 0.95,
  recall: 0.92,
  mAP50: 0.94,
  mAP5095: 0.89,
  valBoxLoss: 0.12,
  valClsLoss: 0.08,
  valDflLoss: 0.15,
};

const HISTORY_DIR = `${FileSystem.documentDirectory}history/`;
const METADATA_FILE = `${HISTORY_DIR}metadata.json`;
const MAX_HISTORY_ITEMS = 5;

interface HistoryItem {
  id: string;
  timestamp: string;
  imagePath: string;
  detections: {
    class: string;
    confidence: number;
    bbox: number[];
    infected: boolean;
  }[];
  statistics: {
    total_cells: number;
    infected_count: number;
    non_infected_count: number;
    class_counts: { [key: string]: number };
  };
}

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureHistoryDir = async () => {
    const dirInfo = await FileSystem.getInfoAsync(HISTORY_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(HISTORY_DIR, { intermediates: true });
    }
  };

  const loadMetadata = async (): Promise<HistoryItem[]> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(METADATA_FILE);
      if (!fileInfo.exists) {
        return [];
      }
      const content = await FileSystem.readAsStringAsync(METADATA_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error loading metadata:', error);
      return [];
    }
  };

  const saveMetadata = async (metadata: HistoryItem[]) => {
    try {
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  };

  const cleanupOldHistory = async () => {
    try {
      const metadata = await loadMetadata();
      if (metadata.length >= MAX_HISTORY_ITEMS) {
        // Get the oldest item to remove
        const oldestItem = metadata[metadata.length - 1];
        try {
          // Delete the oldest image file
          await FileSystem.deleteAsync(oldestItem.imagePath);
          // Remove the oldest item from metadata
          metadata.pop();
          await saveMetadata(metadata);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    } catch (error) {
      console.error('Error cleaning up history:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      // First, cleanup old history if needed
      await cleanupOldHistory();

      const result = await uploadImage(selectedImage);

      // Save image to file system
      await ensureHistoryDir();
      const timestamp = new Date().toISOString();
      const imagePath = `${HISTORY_DIR}${timestamp}.jpg`;
      
      // Copy the image to our history directory
      await FileSystem.copyAsync({
        from: selectedImage,
        to: imagePath,
      });

      // Create history item
      const historyItem: HistoryItem = {
        id: timestamp,
        timestamp,
        imagePath,
        detections: result.detections,
        statistics: result.statistics,
      };

      // Get existing metadata
      const metadata = await loadMetadata();

      // Add new item to the beginning of the array
      metadata.unshift(historyItem);

      // Ensure we don't exceed the limit
      if (metadata.length > MAX_HISTORY_ITEMS) {
        // Remove the oldest item
        const oldestItem = metadata[metadata.length - 1];
        try {
          await FileSystem.deleteAsync(oldestItem.imagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
        metadata.length = MAX_HISTORY_ITEMS;
      }

      // Save updated metadata
      await saveMetadata(metadata);

      // Navigate to Result screen
      navigation.navigate('Result', {
        image: `data:image/jpeg;base64,${result.annotated_image}`,
        detections: result.detections,
        statistics: result.statistics,
      });
    } catch (err) {
      setError('Error processing image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Welcome to Malaria Detection 🔬</Text>
        <Text style={styles.heroSubtitle}>
          A powerful tool for detecting malaria parasites in blood cell images
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Model Performance 📊</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Precision</Text>
            <Text style={styles.metricValue}>{metrics.precision.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Recall</Text>
            <Text style={styles.metricValue}>{metrics.recall.toFixed(2)}</Text>
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
  heroSection: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroSubtitle: {
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

export default HomeScreen; 