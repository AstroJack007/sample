Karmayogi - Government Training Infrastructure Platform
Karmayogi is a platform for discovering and booking government training infrastructure resources across various institutions. This README provides instructions for setting up and running both the frontend and backend components of the application.

Prerequisites
Node.js (v16 or newer)
npm or yarn
PostgreSQL (v14 or newer)
Project Setup
1. Clone the Repository
2. Database Setup
Install and set up PostgreSQL on your machine
Create a new database named registries:
Update database connection details in index.js with your PostgreSQL credentials:
const con = new Client({
    host: "localhost",
    user: "your_postgres_username",
    port: 5432,
    password: "your_postgres_password",
    database: "registries"
});
3. Backend Setup:
 cd backend

 Install dependencies
npm install

Initialize database schema and seed data
node -e "require('./seed.js').initializeSchema()"

Start the server
node index.js
The server will run on port 3000 by default. You should see the message "Server running on port 3000" and "Connected to the database" if everything is working correctly.

4. Frontend Setup
cd frontend

npm install

npm run dev
