# 💰 ExpenseWise

A full-stack personal expense tracking web application built for Web Development 1 final project.

## 🚀 Live Demo

- **Frontend:** [Will add after Netlify deploy]
- **Backend API:** [Will add after Render deploy]

## ✨ Features

- 🔐 User Authentication (Register/Login with JWT)
- 🔑 Secure password hashing with bcryptjs
- ➕ Full CRUD operations for expenses
- 🗂️ 8 expense categories (Food, Transport, Housing, etc.)
- 🔍 Search and filter by category and date range
- 📊 Visual spending chart (HTML Canvas)
- 📱 Fully responsive design
- 💵 Gambian Dalasi (GMD) currency

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- dotenv, cors

### Frontend
- HTML5, CSS3 (custom), Vanilla JavaScript (ES6+)
- normalize.css
- Fetch API
- ES Modules
- HTML Canvas for charts

### Deployment
- Backend: Render
- Frontend: Netlify
- Database: MongoDB Atlas

## 📁 Project Structure
expensewise/
├── public/ # Frontend (HTML, CSS, JS)
│ ├── css/
│ ├── js/
│ ├── index.html # Login page
│ └── dashboard.html # Main app
├── src/ # Backend
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── server.js
│ └── index.js
├── .env # Environment variables
├── .gitignore
└── package.json


## 🔧 Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mr-headphone/expensewise.git
   cd expensewise

2. Install dependencies:

npm install

3.Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

4.Run the backend:
npm run dev

5.Open public/index.html with Live Server. 

📡 API Endpoints
Auth
POST /api/auth/register - Create account
POST /api/auth/login - Login
GET /api/auth/me - Get current user
Expenses
GET /api/expenses - Get all expenses
POST /api/expenses - Create expense
PUT /api/expenses/:id - Update expense
DELETE /api/expenses/:id - Delete expense
GET /api/expenses/summary - Spending by category
🛡️ Security
Passwords hashed with bcryptjs
JWT tokens for authentication
Protected routes via middleware
XSS protection on frontend
Environment variables for secrets
👥 Team
Muhammed E Cham (mr-headphone)
Zainab Jasseh 
📄 License
Built for Web Development 1 final project.

text


5. Scroll down to the bottom
6. Click the green **"Commit changes"** button
