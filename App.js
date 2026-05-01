import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';


export default function App() {
  const [location, setterLocation] = useState(null);
  const [loading, setterLoading] = useState(true);
  const [errorMsg, setterErrorMsg] = useState(null);
  const [airQuality, setterAirQuality] = useState(null);
  const [city, setterCity] = useState(null); 
  const [selectedCity, setterSelectedCity] = useState("Warszawa");
  const [comparisonData, setterComparisonData] = useState(null);
  const cities = [
    { name: "Warszawa", latitude: 52.2297, longitude: 21.0122 },
    { name: "Kraków", latitude: 50.0647, longitude: 19.9450 },
    { name: "Łódź", latitude: 51.7592, longitude: 19.4560 },
    { name: "Wrocław", latitude: 51.1079, longitude: 17.0385 },
    { name: "Poznań", latitude: 52.4064, longitude: 16.9252 },
    { name: "Gdańsk", latitude: 54.3520, longitude: 18.6466 },
    { name: "Szczecin", latitude: 53.4285, longitude: 14.5528 },
    { name: "Bydgoszcz", latitude: 53.1235, longitude: 18 }
  ];
  const getColor = (pm25) => {
    if (pm25 <= 12) {
      return "green";
    } else if (pm25 <= 36) {
      return "yellow";
    } else if (pm25 <= 60) {
      return "orange";
    } else if (pm25 <= 120) {
      return "red";
    } else if (pm25 >= 121) {
      return "purple";
    } 
  }
  const fetchAirQuality = async (latitude, longitude) => { //fetching air quality from open-meteo api
    try {
      const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide`);
      const data = await response.json();
      setterAirQuality(data.current); //setting air quality data
    } catch (error) {
      console.error("Blad pobierania danych", error);
    }
  }

  const fetchComparisonData = async (latitude, longitude) => { //fetching air quality data for comparison
    try {
      const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide`);
      const data = await response.json();
      if (!data?.current) return;
      setterComparisonData(data?.current ?? null);
    } catch (error) {
      console.error("Blad pobierania danych", error);
    }
  }

  const getLocation = async () => {
    setterLoading(true);
    setterErrorMsg(null);
    const { status } = await Location.requestForegroundPermissionsAsync(); //Ask permission 

    if (status !== "granted") { //granted check - hardcoded by expo
      setterErrorMsg("Brak dostępu do lokalizacji");
      setterLoading(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({}); //getting locaiton
      setterLocation(location.coords);
      const geo = await Location.reverseGeocodeAsync(location.coords); //reverse geocoding to get city name (rozszerzenie)
      setterCity(geo[0]?.city); //setting city name
      await fetchAirQuality(location.coords.latitude, location.coords.longitude); //fetching air quality data with the location obtained
    } catch (e) {
      setterErrorMsg("Blad pobierania lokalizacji");
    }
    setterLoading(false);
};


useEffect(() => {
  getLocation();
}, []);

useEffect(() => {
  const cityObj = cities.find(c => c.name === selectedCity);

  if (!cityObj) return;

  fetchComparisonData(cityObj.latitude, cityObj.longitude);
}, [selectedCity]);

if (loading) {
  return (
    <View style={styles.loading}>
      <Text style={[styles.loadingText, { fontSize: 20 }]}>Album: 56432</Text>
      <Text style={styles.loadingText}>Ladowanie</Text>
      <ActivityIndicator size="large" color="#911fd3" />
    </View>
  );
}
if (errorMsg) {
  return (
    <View style={styles.loadingError}>
      <Text>{errorMsg}</Text>
    </View>
  );
}
if (!airQuality) {
  return (
    <View style={styles.loadingError}>
      <Text>Brak danych o jakości powietrza</Text>
    </View>
  );
}
return ( //if everything is ok 
  <View style={[styles.container, { paddingTop: 60}]}>
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Text style={styles.locationText}>Twoja lokalizacja</Text>
      <Text style ={{ fontSize: 16}}>Miasto: {city || "Błąd"}</Text>
      <View style={{ marginTop: 4, flexDirection: 'row' }}>
        <Text style={{ marginRight: 8 }}>Szerokość: {location?.latitude}</Text>
        <Text>Długość: {location?.longitude}</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
       <View style={[styles.card, { backgroundColor: getColor(airQuality?.pm2_5) }]}>
        <Text style={styles.datalabel}>PM2.5:</Text>
        <Text style={styles.dataValue}>{airQuality.pm2_5}</Text>
       </View>
       <View style={[styles.card, { backgroundColor: getColor(airQuality?.pm10) }]}>
        <Text style={styles.datalabel}>PM10:</Text>
        <Text style={styles.dataValue}>{airQuality.pm10}</Text>
       </View>
       <View style={[styles.card, { backgroundColor: getColor(airQuality?.carbon_monoxide) }]}>
        <Text style={styles.datalabel}>Tlenek węgla:</Text>
        <Text style={styles.dataValue}>{airQuality.carbon_monoxide}</Text>
       </View>
       <View style={[styles.card, { backgroundColor: getColor(airQuality?.nitrogen_dioxide) }]}>
        <Text style={styles.datalabel}>Dwutlenek azotu:</Text>
        <Text style={styles.dataValue}>{airQuality.nitrogen_dioxide}</Text>
       </View>
       <View style={[styles.card, { backgroundColor: getColor(airQuality?.ozone) }]}>
         <Text style={styles.datalabel}>Ozon:</Text>
         <Text style={styles.dataValue}>{airQuality.ozone}</Text>
       </View>
       <View style={[styles.card, { backgroundColor: getColor(airQuality?.sulphur_dioxide) }]}>
        <Text style={styles.datalabel}>Dwutlenek siarki:</Text>
        <Text style={styles.dataValue}>{airQuality.sulphur_dioxide}</Text>
       </View>
    </View>
    
    <View>
      
      {comparisonData && (
        <View style={{ width: "100%", marginTop: 20 }}>
          <View style={styles.headerRow}>
          <Text style={{ fontSize: 18, fontWeight: 'bold'}}>
            Porównanie:
          </Text>

          <View style={[{flex:1, marginLeft: 10, backgroundColor: "#f0f0f0", borderRadius: 10}]}>
           <Picker style={{ width: "100%" }}
              selectedValue={selectedCity}
              onValueChange={(value) => { setterComparisonData(null); setterSelectedCity(value); }}>
              {cities.map((city) => (
                <Picker.Item key={city.name} label={city.name} value={city.name} />
              ))}
            </Picker>
          </View>
        </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: 100 }} contentContainerStyle={{ paddingBottom: 0 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[styles.comparisonCard, { backgroundColor: getColor(comparisonData?.pm2_5) }]}>
                <Text style={styles.datalabel}>PM2.5:</Text>
                <Text style={styles.dataValue}>{comparisonData.pm2_5}</Text>
              </View>
              <View style={[styles.comparisonCard, { backgroundColor: getColor(comparisonData?.pm10) }]}>
                <Text style={styles.datalabel}>PM10:</Text>
                <Text style={styles.dataValue}>{comparisonData.pm10}</Text>
              </View>
              <View style={[styles.comparisonCard, { backgroundColor: getColor(comparisonData?.carbon_monoxide) }]}>
                <Text style={styles.datalabel}>Tlenek węgla:</Text>
                <Text style={styles.dataValue}>{comparisonData.carbon_monoxide}</Text>
              </View>
              <View style={[styles.comparisonCard, { backgroundColor: getColor(comparisonData?.nitrogen_dioxide) }]}>
                <Text style={styles.datalabel}>Dwutlenek azotu:</Text>
                <Text style={styles.dataValue}>{comparisonData.nitrogen_dioxide}</Text>
              </View>
              <View style={[styles.comparisonCard, { backgroundColor: getColor(comparisonData?.ozone) }]}>
                <Text style={styles.datalabel}>Ozon:</Text>
                <Text style={styles.dataValue}>{comparisonData.ozone}</Text>
              </View>
              <View style={[styles.comparisonCard, { backgroundColor: getColor(comparisonData?.sulphur_dioxide) }]}>
                <Text style={styles.datalabel}>Dwutlenek siarki:</Text>
                <Text style={styles.dataValue}>{comparisonData.sulphur_dioxide}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingError: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  locationText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  comparisonCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    maxHeight: 80,
    minWidth: 100,
  },
  datalabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
});
