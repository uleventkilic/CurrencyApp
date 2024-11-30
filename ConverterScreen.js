import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import styles from './styles';

export default function ConverterScreen() {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('TRY');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectingBase, setIsSelectingBase] = useState(true); // Hangi dövizin seçildiğini kontrol etmek için
  const API_KEY = '0966b42d4116f9669eafb5ce';

  // Favori döviz kodları
  const favoriteCurrencies = ['USD', 'EUR', 'GBP'];

  // Döviz oranlarını API'den çekme fonksiyonu
  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
      );
      setRates(response.data.conversion_rates); // Döviz oranlarını güncelle
    } catch (error) {
      console.error('Hata:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Kaynak döviz değiştiğinde oranları güncelle
    fetchRates();
  }, [baseCurrency]);

  const handleConvert = () => {
    // Klavyeyi kapatma
    Keyboard.dismiss();

    // Kullanıcıdan geçerli bir miktar girildi mi kontrol et
    if (!amount || isNaN(amount)) {
      setResult('Lütfen geçerli bir miktar girin.');
      return;
    }

    // Hedef döviz oranı mevcut mu kontrol et
    if (!rates[targetCurrency]) {
      setResult('Hedef döviz oranı bulunamadı.');
      return;
    }

    // Oranlara göre çeviri işlemini gerçekleştir
    const convertedAmount = ((amount / rates[baseCurrency]) * rates[targetCurrency]).toFixed(2);
    setResult(`${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`);
  };

  const handleCurrencySelect = (currency) => {
    if (isSelectingBase) {
      setBaseCurrency(currency);
    } else {
      setTargetCurrency(currency);
    }
    setModalVisible(false);
  };

  // Döviz kodlarını sıralama: Favori kodlar en üste
  const getSortedCurrencies = () => {
    const allCurrencies = Object.keys(rates);
    const favoriteCurrenciesSet = new Set(favoriteCurrencies);

    const favorites = allCurrencies.filter((currency) => favoriteCurrenciesSet.has(currency));
    const others = allCurrencies.filter((currency) => !favoriteCurrenciesSet.has(currency));

    return [...favorites, ...others];
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Döviz Çevirici</Text>
        <Text style={styles.loadingText}>Veriler Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Döviz Çevirici</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Çevrilecek Miktar:</Text>
          <TextInput
            style={styles.input}
            placeholder="Miktar Girin"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />

          <Text style={styles.label}>Baz Döviz Birimi:</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => {
              setIsSelectingBase(true);
              setModalVisible(true);
            }}
          >
            <Text style={{ textAlign: 'left', alignSelf: 'flex-start' }}>{baseCurrency}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Hedef Döviz Birimi:</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => {
              setIsSelectingBase(false);
              setModalVisible(true);
            }}
          >
            <Text style={{ textAlign: 'left', alignSelf: 'flex-start' }}>{targetCurrency}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleConvert}>
            <Text style={styles.buttonText}>Çevir</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        {/* Döviz Seçimi için Küçük Modal */}
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.smallModalContainer}>
              <Text style={styles.modalHeader}>
                {isSelectingBase ? 'Baz Döviz Birimi Seçin' : 'Hedef Döviz Birimi Seçin'}
              </Text>
              <FlatList
                data={getSortedCurrencies()} // Favori döviz kodlarını sıralar
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleCurrencySelect(item)}
                  >
                    <Text style={[styles.modalItemText, { textAlign: 'left' }]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: 10 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
