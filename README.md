# URL Shortener

A simple and efficient web application to shorten long URLs, built with React (frontend), Node.js + Express (backend), and MongoDB. Includes an admin page to view all shortened URLs and their visit statistics.

## Features

- Shorten any long URL to a simple, shareable link
- Redirects short URLs to the original long URL
- Tracks the number of visits for each short URL
- Admin page to view all shortened URLs and stats

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Aditya-Mishra9670/URLshortner.git
   cd URLshortner
   ```

2. **Backend Setup:**
   ```sh
   cd server
   npm install
   # Create a .env file (see below for example)
   npm start
   ```
   Example `.env` for backend:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/urlShortener
   BASE_URL=http://localhost:5000
   PORT=5000
   ```

3. **Frontend Setup:**
   ```sh
   cd ../client/urlshortner
   npm install
   # Create a .env file (see below for example)
   npm run dev
   ```
   Example `.env` for frontend:
   ```env
   VITE_API_URL=http://localhost:5000/api/shorten
   ```

---

## Usage Guide

### User Side
1. Open the frontend in your browser (default: http://localhost:5173 or http://localhost:3000)
2. Enter a long URL in the input form and submit.
3. Copy the generated short URL and share it.
4. Visiting the short URL will redirect to the original long URL.

### Admin Page
- Click the "Go to Admin Page" button in the UI.
- View all shortened URLs and their visit counts.

---

## API Endpoints

### 1. Shorten URL
- **POST** `/api/shorten`
- **Body:** `{ "url": "https://www.example.com/very/long/path" }`
- **Response:** `{ "shortUrl": "http://localhost:5000/abc123" }`

### 2. Redirect to Original URL
- **GET** `/:code`
- **Description:** Redirects to the original URL for the given short code.
- **Example:** `GET http://localhost:5000/abc123` → Redirects to the original URL.

### 3. Get All Shortened URLs (Admin)
- **GET** `/api/urls`
- **Response:**
  ```json
  [
    {
      "_id": "...",
      "originalUrl": "https://www.example.com/very/long/path",
      "shortCode": "abc123",
      "shortUrl": "http://localhost:5000/abc123",
      "visitCount": 5,
      "createdAt": "2025-08-26T12:34:56.789Z"
    },
    ...
  ]
  ```

---

## Project Structure

```
URLshortner/
├── client/
│   └── urlshortner/
│       ├── src/
│       ├── .env
│       └── ...
├── server/
│   ├── index.js
│   ├── .env
│   └── ...
└── README.md
```

---

## License

This project is licensed under the MIT License.
