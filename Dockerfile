# Dockerfile
FROM node:18

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build

EXPOSE 8080
ENV PORT=8080

CMD ["npm", "start"]
