# Backend - Employee Leave & Attendance Management System

## Project Overview
This is the backend server for the Employee Leave & Attendance Management System (Mini HR Tool).  
It handles authentication, role-based access, attendance, leave management, and employee data.

---

## Tech Stack
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- dotenv for environment variables

---

## Setup Instructions

1. Clone the repository and navigate to the backend folder:
 cd backend

Install dependencies:
npm install

Create a .env file based on .env.example
PORT=5000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-secret-key>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123


## Admin Credentials (Seeded)
Email: admin@example.com
Password: Admin@123




Run the backend server:
npm run dev


AI Usage Declaration
ChatGPT was used for:
Boilerplate setup (project initialization, auth scaffolding)
Debugging API errors (Clock In/Out, leave approve/reject)
Frontend-backend API testing support
All business logic, database models, and final integration were implemented manually.

Time Spent
Approx 2 days