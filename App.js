import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // İkonlar için

// Ekranlar
import FavoritesScreen from './FavoritesScreen';
import ConverterScreen from './ConverterScreen';
import MarketsScreen from './MarketsScreen';

const Tab = createBottomTabNavigator();

// Ana uygulama giriş noktasıdır.
// Tüm ekranlar ve navigasyon yapısı burada tanımlanır.
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Alt navigasyon çubuğunda her bir sekmenin ikonlarını ayarlamak için kullanılır.
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Favoriler') {
              iconName = focused ? 'star' : 'star-outline';
            } else if (route.name === 'Çevirici') {
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
            } else if (route.name === 'Piyasalar') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#fff' },
        })}
      >
        <Tab.Screen name="Favoriler" component={FavoritesScreen} />
        <Tab.Screen name="Çevirici" component={ConverterScreen} />
        <Tab.Screen name="Piyasalar" component={MarketsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
