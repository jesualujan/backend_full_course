# Usa una imagen oficial de Node.js basada en Alpine (ligera y rápida)
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package.json yarn.lock ./

# Instala las dependencias usando Yarn
RUN yarn install

# Copia el resto del código fuente
COPY . .

# Genera el cliente de Prisma (evita errores de inicialización)
RUN yarn prisma generate

# Expone el puerto en el que corre la app
EXPOSE 5003

# Comando para iniciar el servidor
CMD ["node", "./src/server.js"]
