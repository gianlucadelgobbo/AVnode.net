FROM node:18

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto
COPY . .

# Crea le directory se non esistono
RUN mkdir -p public/scss public/css

# Esponi la porta
EXPOSE 3000

# Comando di avvio
CMD ["npm", "start"] 