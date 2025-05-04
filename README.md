

# 🌐 Karmayogi – Government Training Infrastructure Platform

Karmayogi is a unified platform that enables discovery, filtering, and booking of training infrastructure across government institutions. From classrooms and labs to hostels and faculty resources, Karmayogi brings siloed assets under one searchable system.

---

## 🚀 Features

* 🔍 Search and filter assets by type, location, amenities, and availability
* 📅 Book infrastructure with a date/time locking system
* 🏛 Admin dashboard for institutions to manage listings
* 📊 Designed for government departments, ministries, and training institutes

---

## ⚙️ Tech Stack

* **Frontend**: React
* **Backend**: Node.js (with PostgreSQL)
* **Database**: PostgreSQL
* **Others**: Simple REST API, CLI-based DB seeding

---

## 🧰 Prerequisites

Ensure the following are installed on your machine:

* Node.js (v16 or newer)
* npm or yarn
* PostgreSQL (v14 or newer)

---

## 🛠️ Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/karmayogi-platform.git
cd karmayogi-platform
```

---

### 2️⃣ Set Up the Database

1. Install PostgreSQL and create a new database named `registries`.
2. Update your `backend/index.js` with your DB credentials:

```js
const con = new Client({
  host: "localhost",
  user: "your_postgres_username",
  port: 5432,
  password: "your_postgres_password",
  database: "registries"
});
```

---

### 3️⃣ Backend Setup

```bash
cd backend
npm install
```

**Initialize schema and seed sample data:**

```bash
node -e "require('./seed.js').initializeSchema()"
```

**Start the server:**

```bash
node index.js
```

> The backend should now be running at `http://localhost:3000`. Look for:
>
> * `Server running on port 3000`
> * `Connected to the database`

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> The frontend will be available at `http://localhost:5173` or your local Vite port.

---



