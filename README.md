# 🎓 Student Needs – Unified Student Support Platform

Student Needs is a full-stack student management platform designed to bring multiple essential student services into a single, unified application. Instead of using separate platforms for attendance, expenses, tutoring, and alumni referrals, students can access everything through one dashboard.

The platform provides dedicated modules for **Attendance Management, Expense Tracking, Tutor Finder, and Alumni Referrals**, with a unified authentication system and personalized student dashboard.

## 🌐 Live Demo

https://student-needs.vercel.app/

---

## 📸 Screenshots


<img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/93792bd8-3ab1-4aa5-824c-ac06fd3f1fc6" />
<img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/6795356a-31b7-43c3-907c-ee700b2f310d" />
<img width="1919" height="1010" alt="image" src="https://github.com/user-attachments/assets/49cad9bc-f747-45fe-8573-bf944222f4ac" />
<img width="1919" height="1013" alt="image" src="https://github.com/user-attachments/assets/5cd179d0-f8ac-4341-b204-d8d7b19186de" />
<img width="1919" height="1005" alt="image" src="https://github.com/user-attachments/assets/8e39b34a-e1f7-49f0-a260-6b1cc808989c" />
<img width="1919" height="1019" alt="image" src="https://github.com/user-attachments/assets/bd1cb6a1-d1e6-4461-866d-06b13ff1db01" />
<img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/c745c042-2df4-4384-b499-d4267d8937d5" />
<img width="1919" height="1008" alt="image" src="https://github.com/user-attachments/assets/5c7516d0-8047-4517-b993-ae429c8d05a3" />
<img width="1917" height="1017" alt="image" src="https://github.com/user-attachments/assets/d1acf6e1-f4c3-40c4-a902-a79701117db0" />
<img width="474" height="866" alt="image" src="https://github.com/user-attachments/assets/59164e76-2fd0-46c7-bd1d-3fb712eb305b" />
<img width="1919" height="979" alt="image" src="https://github.com/user-attachments/assets/c444d4ca-aa11-48e2-a401-c62564a00c7f" />
<img width="1919" height="1020" alt="image" src="https://github.com/user-attachments/assets/ecec015d-a8bd-4e44-ab2d-a3a6680edcb0" />
<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/fb6c8a53-8e7d-40a1-a2c3-addf6992cafd" />
<img width="1800" height="1009" alt="image" src="https://github.com/user-attachments/assets/dea46511-0f30-4af3-b43e-1bbf3c893a91" />


---

## 🚀 Features

* 🎓 Unified student dashboard
* 🔐 JWT-based authentication and protected routes
* 📊 Attendance management and tracking
* 💰 Expense tracking and financial management
* 👨‍🏫 Tutor finder for connecting students with tutors
* 🤝 Alumni referral system
* 📈 Dashboard with an overview of student activities
* 🔎 Search and filtering functionality
* 💾 Persistent data storage using MongoDB
* 📱 Responsive and modern user interface

---

## 📚 Modules

### 📊 Attendance Management

Students can monitor their attendance across different subjects.

* View subject-wise attendance
* Track attendance percentage
* View attendance records
* Identify subjects requiring attention

### 💰 Expense Tracker

Helps students manage and monitor their personal expenses.

* Add and manage transactions
* Categorize expenses
* Track spending patterns
* View expense summaries and analytics

### 👨‍🏫 Tutor Finder

Allows students to find suitable tutors based on their requirements.

* Browse available tutors
* Search for tutors
* View tutor information
* Find tutors based on relevant subjects

### 🤝 Alumni Referrals

Connects students with alumni for career and referral opportunities.

* Browse alumni profiles
* Explore referral opportunities
* Search/filter alumni
* Connect students with relevant alumni

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* REST APIs

### Tools

* Git & GitHub
* MongoDB Atlas
* MongoDB Compass
* VS Code

---

## 🏗 Architecture

```text
                         Student
                            │
                            ▼
                  React + Vite Frontend
                            │
                            ▼
                  Unified Authentication
                            │
                            ▼
                   Student Needs Dashboard
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
        ─────────────────────────────────────────
                Student Needs Platform         
                                               
                📊 Attendance Management              
                💰 Expense Tracker                    
                👨‍🏫 Tutor Finder                       
                🤝 Alumni Referrals                    
                                                     
       ────────────────────┬────────────────────
                           │
                           ▼
                    Express.js Backend
                           │
                           ▼
                        MongoDB
```

All four modules are integrated into a **single Student Needs platform** and are accessible through the unified student dashboard. The frontend communicates with the Express.js backend through REST APIs, while MongoDB provides persistent data storage for the different modules.

---

## 🔐 Authentication & Authorization

Student Needs uses JWT-based authentication to provide secure access to the platform.

```text
User
 │
 ▼
Login / Registration
 │
 ▼
JWT Authentication
 │
 ▼
Protected Routes
 │
 ▼
Student Dashboard
 │
 ├── Attendance
 ├── Expenses
 ├── Tutor Finder
 └── Alumni Referrals
```

Protected routes ensure that authenticated users can access the appropriate modules and student data.

---





## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/vagmin27/Student_Needs.git
cd Student_Needs
```

### Backend

```bash
cd backend
npm install
npm run dev
node index.js
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT = 
MONGO_URI = 
JWT_SECRET=
SMTP_USER=
SMTP_PASS=
SESSION_SECRET=

FRONTEND_URL = 
GEMINI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Add any additional environment variables required by the individual modules.

---

## 🔌 API Architecture

The application follows a RESTful API architecture.

```text
React Frontend
      │
      │ HTTP Requests
      ▼
Express.js API
      │
      ├── Authentication APIs
      ├── Attendance APIs
      ├── Expense APIs
      ├── Tutor APIs
      └── Alumni/Referral APIs
      │
      ▼
   MongoDB
```

---

## 🎯 Project Objective

The main objective of Student Needs is to provide students with a **single platform for managing their academic, financial, learning, and career-related needs**.

By integrating multiple independent modules into one application, the platform reduces the need to switch between different systems while providing a consistent user experience through a unified dashboard.

---



