# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./


RUN npm install 

# Копируем все файлы проекта в контейнер
COPY . .

# Собираем проект для продакшн
RUN npm run build

# Открываем порт для Next.js
EXPOSE 3000

# Запускаем приложение в продакшн-режиме
CMD ["npm", "start"]
