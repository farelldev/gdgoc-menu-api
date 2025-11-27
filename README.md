# GDGoC Menu Catalog API ✨

A powerful and simple **Menu Catalog REST API** built using **Node.js, Express, SQLite**, and **Gemini AI integration** for automated menu description generation.

Project created for **Google Developer Groups on Campus (GDGoC) — Role: Hacker (Backend)**.

## 🚀 Features

✔ CRUD: Create, Read, Update, Delete menu items
✔ Filtering & Searching by category, calories, keyword
✔ Sorting (name, price, calories, etc.)
✔ Pagination support
✔ SQLite database + auto seed
✔ **AI-powered description** using Gemini API 🧠
✔ Postman collection included

---

## 📂 Project Structure

```bash
gdgoc-menu-api-final/
│ .env.example           # Example environment variables (no secret key)
│ package.json           # Dependencies & scripts
│ package-lock.json
│ README.md              # You are here
│ database.sqlite (ignored by default) ❌ → generated via command
│ sql/
│   └── init.sql         # DB structure if needed
│ src/
│   ├── server.js        # Run Express server
│   ├── db.js            # SQLite handler & seed
│   ├── controllers/
│   │   └── menuController.js
│   ├── models/
│   │   └── menuModel.js
│   └── routes/
│       └── menuRoutes.js
└── gdgoc-menu-api.postman_collection.json
```

📌 **Note:** `.env` file is NOT included for security reasons.
You must create your own from `.env.example`.

---

## 🔑 Environment Variables

Edit `.env.example` → rename to `.env`

```env
PORT=3000
GEMINI_API_KEY=YOUR_API_KEY_HERE
BASE_URL=http://localhost:3000
```

### How to get Gemini API Key?

👉 [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## 🛠️ Installation & Setup

```bash
# 1️⃣ Install dependencies
npm install

# 2️⃣ Initialize database
npm run init-db

# 3️⃣ Run server
npm start
```

Server running at:
➡ [http://localhost:3000](http://localhost:3000)

---

## 📌 API Endpoints

| Method | Endpoint                        | Description                             |
| ------ | ------------------------------- | --------------------------------------- |
| GET    | `/menu`                         | Get all menu (filter, sort, pagination) |
| GET    | `/menu/:id`                     | Get a single menu item                  |
| POST   | `/menu`                         | Add new menu item                       |
| PUT    | `/menu/:id`                     | Update menu item                        |
| DELETE | `/menu/:id`                     | Delete menu item                        |
| POST   | `/menu/ai/generate-description` | Generate description (Gemini AI)        |

---

## 🔍 Query Params

Example:

```
GET /menu?category=drinks&sort=price&order=asc&page=1&limit=5
```

| Param      | Example        | Description        |
| ---------- | -------------- | ------------------ |
| `category` | `foods`        | Filters category   |
| `sort`     | `price`        | Sorting field      |
| `order`    | `asc` / `desc` | Sorting direction  |
| `page`     | `1`            | Pagination page    |
| `limit`    | `5`            | Max items per page |
| `search`   | `es`           | Search by name     |

---

## 🤖 AI Integration — Gemini

### Request Body Example

```json
POST /menu/ai/generate-description
{
  "name": "Es Jeruk"
}
```

### Response Example

```json
{
  "description": "Freshly squeezed orange juice served chilled over ice."
}
```

> AI generates a professional menu description automatically ✨

---

## 🧪 Postman Collection

Import file: 📁 `gdgoc-menu-api.postman_collection.json`

Sudah tersedia lengkap dengan contoh request dan body format.

---

## 🎥 Demo Video

📌 Akan disertakan dalam submission:
➡ YouTube / Drive link (coming soon)

---

## 🧑‍💻 Tech Stack

* Node.js + Express
* SQLite + Better-SQLite3 ORM
* Google Gemini AI API
* Postman

---

## 👤 Author

**Farelldeo Lionel Chalvary**
Backend Hacker — GDGoC 2025

📧 Contact: *coming soon*
🔗 GitHub Repo Link: *added later*

---

## 📜 License

This project is licensed under **MIT License**.

---

Terima kasih telah berkunjung 🎉🔥 `Now you can test the API using Postman or browser!`
