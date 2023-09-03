# BookShop_BackEnd
тест логин - alexkorsakow
     пароль- q

## Установка и запуск

1. Клонировать репозиторий: `git clone [https://github.com/GitKors/BookShop_BackEnd.git]`
2. Установить зависимости: `npm install`
3. Запустить сервер: `npm run dev`
4. cd bookshop-frontend
5. Установить зависимости: `npm install`
6. Запустить Реакт `npm start` (на 3001...)

## API

### Пользователи

#### Регистрация

- **URL**: `/api/v1/users/register`
- **Метод**: `POST`
- **Тело запроса**: 
  - `username` (string): Имя пользователя
  - `password` (string): Пароль

#### Вход

- **URL**: `/api/v1/users/login`
- **Метод**: `POST`
- **Тело запроса**:
  - `username` (string): Имя пользователя
  - `password` (string): Пароль

### Книги

#### Получить все книги

- **URL**: `/api/v1/books`
- **Метод**: `GET`

#### Получить книги по категории

- **URL**: `/api/v1/books/categories/:categoryName`
- **Метод**: `GET`
- **Параметры URL**: 
  - `categoryName` - название категории (например, "Роман")

### Категории

#### Получить все категории

- **URL**: `/api/v1/categories`
- **Метод**: `GET`

## Модели данных

### User

- **id** (number): Уникальный идентификатор пользователя
- **username** (string): Имя пользователя
- **password** (string): Хэшированный пароль

### Book

- **id** (number): Уникальный идентификатор книги
- **title** (string): Название книги
- **price** (number): Цена книги
- **coverUrl** (string): URL обложки книги
- **description** (string): Описание книги
- **authorname** (string): Имя автора книги
- **categoryname** (string): Категория книги
- **averagerating** (string): Средний рейтинг книги
