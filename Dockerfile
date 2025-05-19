# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos al contenedor
COPY . .

# Instala dependencias
RUN npm install --legacy-peer-deps

# Expone el puerto (ajústalo si tu Next.js está en otro puerto)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
