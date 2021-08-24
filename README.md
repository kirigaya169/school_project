# school_project
Это простой сайт для школьного проекта, использующий MERN stack.

## Установка
```
git clone https://github.com/kirigaya169/school_project.git
cd school_project/
```

## Настройка сервера
```
cd server/
npm i
touch .env
```
В файле `.env` необходимо прописать переменные окружения:
- `SERVER_PORT` - порт, на котором будет запущен сервер
- `TOKEN_KEY` - ключ для JWT-токена
- `DB_ADDRESS` - адресс базы данных mongoDB
Запуск сервера: 
```
nodemon index.js
```

## Настройка клиента
```
cd client/
npm i
touch .env
```

В файле `.env` должна быть единственная переменная окружения: `REACT_APP_SERVER_HOST` - адресс сервера.
Запуск React-сервера:
```
npm run start
```
