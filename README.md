# Team Task Manager

A full-stack project management application built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Features
- **User Authentication:** Secure Signup & Login with JWT and Bcrypt.
- **Role-Based Access Control:** Admin vs Member views. Admins can create tasks and manage projects.
- **Task Management:** Real-time dashboard showing tasks categorized by status (To Do, In Progress, Done).
- **Stunning UI:** Built with React and a modern glassmorphism CSS architecture.

## 🛠 Tech Stack
- **Frontend:** React (Vite), React Router DOM, Lucide Icons, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)

## 🏃‍♂️ How to Run Locally

### 1. Database Setup
You need a running instance of MongoDB. 
- You can install [MongoDB Community Server](https://www.mongodb.com/try/download/community) locally.
- Or use a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
Create a `.env` file in the `backend` folder and add your connection string:
```
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=super_secret_key_123
PORT=5000
```

### 2. Start the Backend
```bash
cd backend
npm install
npm start (or node index.js)
```

### 3. Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

## 🌐 How to Deploy to Railway

To meet the mandatory deployment requirement for your assignment:

1. **Push to GitHub**: Commit this entire repository to a public or private GitHub repository.
2. **MongoDB Atlas**: Ensure your database is hosted on MongoDB Atlas (Railway does not host MongoDB natively for free anymore). Get the connection string.
3. **Railway Dashboard**:
   - Go to [Railway.app](https://railway.app/) and create a new project.
   - Select **"Deploy from GitHub repo"**.
   - Select your newly created repository.
4. **Environment Variables on Railway**:
   - Go to the Variables tab of your backend deployment on Railway.
   - Add `MONGO_URI` (your Atlas URI) and `JWT_SECRET`.
5. **Frontend Deployment**:
   - You can deploy the frontend on Railway as well by configuring the root directory to `frontend` and the build command to `npm run build`. 
   - Make sure to change `http://localhost:5000` in `frontend/src/context/AuthContext.jsx` and `Dashboard.jsx` to your deployed Railway backend URL before building!

## 📸 Screenshots
*(Add your screenshots here for the assignment submission!)*
