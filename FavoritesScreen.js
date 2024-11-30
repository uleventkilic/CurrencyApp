import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles';

// Kullanıcının favori döviz birimlerini listeleyen ekran bileşeni.
// Favori dövizler API'den çekilen verilere göre görüntülenir.
export default function FavoritesScreen() {
  const [rates, setRates] = useState({});
  const [favoriteCurrencies, setFavoriteCurrencies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const API_KEY = '0966b42d4116f9669eafb5ce';

  // Favorileri kaydetme fonksiyonu
  const // Kullanıcının seçtiği favori döviz birimlerini AsyncStorage'a kaydeder.
  saveFavorites = async (favorites) => {
    try {
      await AsyncStorage.setItem('favoriteCurrencies', JSON.stringify(favorites));
      console.log('Favoriler kaydedildi:', favorites);
    } catch (e) {
      console.error('Favoriler kaydedilemedi:', e);
    }
  };

  // Favorileri yükleme fonksiyonu
  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favoriteCurrencies');
      if (favorites) {
        setFavoriteCurrencies(JSON.parse(favorites));
        console.log('Favoriler yüklendi:', JSON.parse(favorites));
      } else {
        setFavoriteCurrencies(['USD', 'EUR', 'GBP']); // Varsayılan favoriler
      }
    } catch (e) {
      console.error('Favoriler yüklenemedi:', e);
    }
  };

  const fetchRates = async () => {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/TRY`
      );
      setRates(response.data.conversion_rates);
    } catch (error) {
      console.error('Hata:', error.message);
    }
  };

  useEffect(() => {
    loadFavorites(); // Favorileri yükle
    fetchRates();
  }, []);

  const toggleFavorite = (currency) => {
    let updatedFavorites;
    if (favoriteCurrencies.includes(currency)) {
      updatedFavorites = favoriteCurrencies.filter((item) => item !== currency);
    } else {
      updatedFavorites = [...favoriteCurrencies, currency];
    }
    setFavoriteCurrencies(updatedFavorites);
    saveFavorites(updatedFavorites); // Favori listesi güncellendiğinde kaydet
  };

  // Döviz listesini sıralama: Seçilenler en üste
  const getSortedCurrencies = () => {
    const allCurrencies = Object.keys(rates);
    const selected = allCurrencies.filter((currency) => favoriteCurrencies.includes(currency));
    const unselected = allCurrencies.filter((currency) => !favoriteCurrencies.includes(currency));
    return [...selected, ...unselected];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favori Dövizler</Text>

      {/* Favori dövizler listesi */}
      <FlatList
        data={favoriteCurrencies.map((code) => ({
          code,
          forexBuying: rates[code] ? (1 / rates[code]).toFixed(2) : '-',
          forexSelling: rates[code] ? (1 / rates[code] * 1.005).toFixed(2) : '-',
        }))}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.listRow}>
            <Text style={styles.currencyCode}>{item.code}</Text>
            <Text style={styles.currencyRate}>Alış: {item.forexBuying} TL</Text>
            <Text style={styles.currencyRate}>Satış: {item.forexSelling} TL</Text>
          </View>
        )}
      />

      {/* Favori düzenleme butonu */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Favorileri Düzenle</Text>
      </TouchableOpacity>

      {/* Favori düzenleme ekranı */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.header}>Favori Dövizleri Seçin</Text>
          <FlatList
            data={getSortedCurrencies()} // Seçilenleri en üste sıralar
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listRow,
                  favoriteCurrencies.includes(item) && { backgroundColor: '#e6f7ff' },
                ]}
                onPress={() => toggleFavorite(item)}
              >
                <Text style={styles.currencyCode}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Tamam" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
