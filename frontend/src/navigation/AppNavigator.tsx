import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import ResultScreen from '../screens/ResultScreen';
import MetricsScreen from '../screens/MetricsScreen';
import HistoryScreen from '../screens/HistoryScreen';

export type RootStackParamList = {
  Main: undefined;
  Result: {
    image: string;
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
  };
  Home: undefined;
  Predict: undefined;
  Metrics: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTintColor: '#2c3e50',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            title: 'Detection Results',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'MalariaDetect' }}
        />
        <Stack.Screen 
          name="Metrics" 
          component={MetricsScreen} 
          options={{ title: 'Model Metrics' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{ title: 'Detection History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 