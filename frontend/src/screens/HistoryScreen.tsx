import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as FileSystem from 'expo-file-system';

interface DetectionResult {
  id: string;
  timestamp: string;
  imagePath: string;
  detections: any[];
  statistics: any;
}

const METADATA_FILE = `${FileSystem.documentDirectory}metadata.json`;

const HistoryScreen = () => {
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const content = await FileSystem.readAsStringAsync(METADATA_FILE);
      const data: DetectionResult[] = JSON.parse(content);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError('No history found.');
      setHistory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const renderItem = ({ item }: { item: DetectionResult }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagePath }} style={styles.image} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.detail}>
          Detections: {item.detections?.length ?? 0}
        </Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Recent History 🔍</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>
          {error ?? 'No history available.'}
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 12,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#555',
    fontSize: 16,
  },
});

export default HistoryScreen;
