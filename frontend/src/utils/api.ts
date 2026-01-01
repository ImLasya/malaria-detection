import axios from 'axios';
import { Platform } from 'react-native';

// Get the appropriate API URL based on the platform
const getApiUrl = () => {
  // if (Platform.OS === 'android') {
  //   // Android emulator uses 10.0.2.2 to access host machine's localhost
  //   return 'http://10.0.2.2:8000';
  // } else if (Platform.OS === 'ios') {
  //   // iOS simulator uses localhost
  //   return 'http://localhost:8000';
  // } else {
    // Physical device needs the actual IP address of your computer
    // Replace with your computer's IP address
    return 'http://192.168.223.26:8000';
  // }
};

const API_URL = getApiUrl();

export const uploadImage = async (imageUri: string) => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename || 'image.jpg',
    } as any);

    console.log('Uploading to:', API_URL);
    const response = await axios.post(`${API_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
}; 