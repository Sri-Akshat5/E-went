# 🎟️ Event Management Platform

A **full-stack** event management application that allows users to create and manage events. Built with **React, Node.js, Express, and MongoDB**, this app supports **user authentication, real-time event updates, and guest login**.

---

## 🚀 Features
✅ **User Registration & Login (JWT Authentication)**  
✅ **Guest Mode (Limited Access valid)**  
✅ **Event Creation, Update & Delete (For Admins)**  
✅ **Category & Date Filters for Easy Browsing**  
✅ **Mobile Responsive UI (Tailwind CSS + React)**  
✅ **Real-time Updates using Socket.IO**  
✅ **Deployed on Vercel & Render**  

---

## 🛠️ Tech Stack
### **Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios (API calls)
- React Router DOM

### **Backend:**
- Node.js & Express.js
- MongoDB (Mongoose)
- JWT for Authentication
- Socket.IO (Real-time updates)

### **Deployment:**
- **Frontend** → Vercel  
- **Backend** → Render  
- **Database** → MongoDB Atlas  

---

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**
```
git clone https://github.com/your-username/event-management-app.git
cd event-management-app
```
### **2️⃣ Backend Setup**
```
cd event-management-backend
npm install
```
### *Configure Environment Variables (.env)*
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### *Run Backend Server*
```
npm start
OR
nodemon start
OR
node start
```
### **3️⃣ Frontend Setup**
```
cd event-management-frontend
npm install
```

### *Run Frontend*
```
npm run dev
```
### 📌 Usage
## *User Actions*
- Register/Login to create & manage events
- Guests can browse events but cannot create events
- Admins can edit, delete & manage their created events
- Users can view events & attendee count updates automatically



## 🔗 Links 
- Frontend Deployment: https://e-went.vercel.app/
- Backend Deployment: https://e-went.onrender.com
- Portfoilio: https://akshat-srivastava-navy.vercel.app/



