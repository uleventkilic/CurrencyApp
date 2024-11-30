import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const allCurrencies = [
  { code: 'USD', name: 'Amerikan Doları' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'İngiliz Sterlini' },
  { code: 'JPY', name: 'Japon Yeni' },
  { code: 'AUD', name: 'Avustralya Doları' },
];

// Kullanıcının favori döviz birimlerini düzenlemesini sağlar.
// Seçimler AsyncStorage'a kaydedilir ve diğer ekranlarda kullanılır.
export default function EditFavoritesScreen({ navigation, route }) {
  const { favorites = [] } = route.params || {};
  const [localFavorites, setLocalFavorites] = useState(favorites);

  const toggleFavorite = (currency) => {
    if (localFavorites.find((fav) => fav.code === currency.code)) {
      setLocalFavorites(localFavorites.filter((fav) => fav.code !== currency.code));
    } else {
      setLocalFavorites([...localFavorites, currency]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorileri Düzenle</Text>

      <FlatList
        data={allCurrencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.currencyRow}>
            <Text style={styles.currencyText}>{item.name} ({item.code})</Text>
            <TouchableOpacity
              style={[
                styles.button,
                localFavorites.find((fav) => fav.code === item.code) ? styles.removeButton : styles.addButton,
              ]}
              onPress={() => toggleFavorite(item)}
            >
              <Text style={styles.buttonText}>
                {localFavorites.find((fav) => fav.code === item.code) ? 'Çıkar' : 'Ekle'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => navigation.navigate('Favoriler', { favorites: localFavorites })}
      >
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007aff' },
  currencyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  currencyText: { fontSize: 18 },
  button: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  addButton: { backgroundColor: '#007aff' },
  removeButton: { backgroundColor: '#ff3b30' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
