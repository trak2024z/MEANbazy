# Wybór obrazu bazowego
FROM node:18

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie plików package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie pozostałych plików źródłowych aplikacji
COPY . .

# Budowanie aplikacji dla produkcji
RUN npm run build

# Instalacja serwera HTTP do serwowania plików statycznych
RUN npm install -g serve

# Ustawienie portu, na którym będzie dostępna aplikacja
EXPOSE 3000

# Uruchomienie serwera HTTP, serwującego zbudowaną aplikację
CMD ["serve", "-s", "build", "-l", "3000"]
