import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { uploadImage } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

type PredictScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Predict'>;

const METADATA_FILE = `${FileSystem.documentDirectory}metadata.json`;

const PredictScreen = () => {
  const navigation = useNavigation<PredictScreenNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setError(null);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const result = await uploadImage(selectedImage);

      // Save image to local filesystem
      const fileName = `prediction_${Date.now()}.jpg`;
      const destPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: selectedImage, to: destPath });

      // Load existing metadata
      let metadata: any[] = [];
      try {
        const content = await FileSystem.readAsStringAsync(METADATA_FILE);
        metadata = JSON.parse(content);
      } catch (e) {
        console.log('No existing metadata found.');
      }

      // Create new item
      const newItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        imagePath: destPath,
        detections: result.detections,
        statistics: result.statistics,
      };

      // Update metadata (keep only last 5)
      metadata.unshift(newItem);
      const trimmed = metadata.slice(0, 5);
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(trimmed));

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
      <View style={styles.content}>
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="image-outline" size={48} color="#8e8e93" />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImage}>
              <Ionicons name="images" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedImage && !loading && (
          <TouchableOpacity style={styles.analyzeButton} onPress={handleUpload}>
            <Text style={styles.analyzeButtonText}>Analyze Image</Text>
          </TouchableOpacity>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Analyzing image...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8e8e93',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  galleryButton: {
    backgroundColor: '#5856d6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8e8e93',
  },
  errorContainer: {
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  error: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default PredictScreen;
