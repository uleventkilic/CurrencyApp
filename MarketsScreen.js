import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import axios from 'axios';
import styles from './styles';

// Tüm döviz birimlerini ve piyasa oranlarını listeleyen ekran.
// API çağrılarıyla veriler alınır ve kullanıcıya sunulur.
export default function MarketsScreen() {
  const [rates, setRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const API_KEY = '0966b42d4116f9669eafb5ce';

  const // API'den döviz oranlarını çekmek için kullanılan fonksiyon.
  fetchRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/TRY`
      );

      const allRates = Object.entries(response.data.conversion_rates).map(([key, value]) => ({
        code: key,
        forexBuying: (1 / value).toFixed(2),
        forexSelling: (1 / value * 1.005).toFixed(2),
      }));

      setRates(allRates);
      setFilteredRates(allRates);
    } catch (error) {
      console.error('Hata:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = rates.filter((rate) =>
      rate.code.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredRates(filtered);
  }, [searchQuery, rates]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Tüm Döviz Kurları</Text>
        <Text style={styles.loadingText}>Veriler Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tüm Döviz Kurları</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Döviz Ara (örn: USD)"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredRates}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.listRow}>
            <Text style={styles.currencyCode}>{item.code}</Text>
            <Text style={styles.currencyRate}>Alış: {item.forexBuying} TL</Text>
            <Text style={styles.currencyRate}>Satış: {item.forexSelling} TL</Text>
          </View>
        )}
      />
    </View>
  );
}
