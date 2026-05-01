# Air Quality - 4.2 Jakość powietrza w miejscu użytkownika
## Aplikacja
Aplikacja wyświetla aktualne dane jakości powietrza w lokalizacji użytkownika oraz umożliwia porównanie jej z innymi miastami.

## Dane z urzadzenia
Aplikacja korzysta z GPS poprzez 'expo location'.
Pobiera dane takie jak:
- szerokość geograficzna,
- długość geograficzna,
- nazwa miasta
Dane są wyświetlane po uruchomieniu aplikacji oraz udzieleniu zgody na dostep do lokalizacji.

## API
Do realizacji zadania wykorzystano publiczne API Open-Meteo Air Quality API
Endpoint: https://air-quality-api.open-meteo.com/v1/air-quality
Parametry endpointu:
- latitude,
- longitude
- current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide

## Biblioteki
- 'expo-location' - dostęp do GPS i geocoding
- 'react native' - budowa interfejsu
- 'react' - zarzadzanie stanem
- '@react-native-picker/picker' - wybór miasta do porównania

## DataFlow
1. Uruchomienie aplikacji
2. Zgoda na lokalizacje
3. Odczyt danych GPS
4. Reverse geocoding (nazwa miasta)
5. Pobranie danych powietrza z API
6. Wyświetlenie wyników

## Funkcjonalności
- Pobieranie lokalizacji użytkownika,
- Wyświetlenie danych,
- Kolor w zależności od poziomu zanieczyszczenia,
- Picker miast

## Stany
- `location` - Dane GPS
- `loading` - Stan ładowania aplikacji
- `errorMsg` - Obsługa błędów
- `airQuality` - Dane jakości powietrza dla użytkownika (aktualne położenie)
- `city` - Nazwa miasta z geocodingu
- `selectedCity` - Wybranie miasta dla porównania
- `comaprisonData` - Dane jakości powietrza dla wybranego miasta

## Problemy
- Problemy layoutowe (poprawne wyświetlenie danych)
- Brak danych dla niektórych lokalizacji (usunieto z wyboru)
- Brak trybu offline
- Crash aplikacji przy zbyt szybkim wybieraniu miast (naprawiono ustawiając za każdym razem na null przy zmianie) 
<img width="457" height="904" alt="IMG_20260501_145509" src="https://github.com/user-attachments/assets/fe5364c8-34ff-4e1c-93fe-d8a5af658bba" />
