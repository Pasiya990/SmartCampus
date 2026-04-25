# 🚀 Resora – Smart Campus Operations Hub

Resora is a full-stack Smart Campus Operations Hub designed to manage **incident tickets, resource bookings, notifications, and analytics** in a centralized system.

The system improves campus efficiency through **real-time updates, automation, and role-based access control**.

---

## 📌 System Overview

Resora enables users to:
- Report and track incidents  
- Book and manage campus resources  
- Receive real-time notifications  
- Analyze operational data through dashboards  

---

## 🎯 Key Features

---

### 🎫 Incident Ticket Management
- Create tickets with validation  
- File attachments support  
- Auto-generated ticket codes  
- Ticket lifecycle:
  - OPEN → IN_PROGRESS → RESOLVED → CLOSED  

---

### 🔔 Notification System
Real-time notification system for better user experience.

#### Features:
- Live notifications (no refresh required)  
- Mark as read / delete notifications  
- Mark all as read / clear all  
- Enable / disable notifications (user preference)  

#### Backend:
- Notification Entity  
- Repository layer  
- Service & Service Implementation  
- REST Controller  

#### Frontend:
- NotificationBell component  
- API integration for CRUD operations  

---

### 📊 Admin Dashboard with Analytics
Interactive dashboard for administrators with key insights:

- Top booked resources  
- Peak booking hours  
- Booking status distribution  
- Busiest days  
- Resource type usage  

#### Visualizations:
- Bar Charts  
- Pie Charts  

---

### 📅 Booking Management

#### Core Features:
- Create and manage resource bookings  
- Booking details include:
  - Date & Time  
  - Purpose  
  - Number of attendees  

---

#### Booking Lifecycle:
- PENDING → APPROVED → CANCELLED  
- PENDING → REJECTED  

---

#### ⚙️ Booking Rules:
- Only PENDING bookings can be edited  
- Editing resets status → PENDING  
- Prevent overlapping bookings for the same resource  

---

#### ❌ Booking Actions:
- Cancel booking → Allowed for PENDING & APPROVED  
- Delete booking → Allowed for REJECTED & CANCELLED  
- Users can manage only their own bookings  

---

#### 🔍 Booking Tracking:
- Filter by:
  - All  
  - Upcoming  
  - Pending  
  - Rejected  
  - Cancelled  
- Real-time counts for each category  

---

### 👨‍🔧 Technician Dashboard
- View assigned tickets  
- Status breakdown analytics  
- Recent ticket activity  
- SLA monitoring  

---

### 🏢 Resource Management
- Manage campus resources  
- Track availability & capacity  
- Automatic status updates:
  - IN_PROGRESS → OUT_OF_SERVICE  
  - RESOLVED/CLOSED → ACTIVE  

---

### 💬 Comment System
- Add comments to tickets  
- Only comment owner can edit/delete  

---

### 🔐 Authentication & Authorization
- JWT-based authentication  
- Role-based access:
  - Admin  
  - Technician  
  - User  
- Secure API endpoints  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- Axios  
- CSS  

### Backend
- Spring Boot  
- REST APIs  
- Spring Security (JWT)  

### Database
- PostgreSQL (Railway)  

---

## 📂 Project Structure

SmartCampus/
│
├── backend/
│   ├── controller/  
│   ├── service/  
│   ├── service/impl/  
│   ├── repository/  
│   ├── model/  
│   ├── dto/  
│   └── config/  
│
├── frontend/
│   ├── components/  
│   ├── pages/  
│   ├── services/  
│   └── styles/  
│
└── README.md  

---

## ⚙️ Setup Instructions

### 🔹 Clone Repository
```bash
git clone https://github.com/your-username/resora.git
cd resora

🔹 Backend Setup
cd backend
mvn clean install
mvn spring-boot:run

Update application.properties:
spring.datasource.url=YOUR_DB_URL
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

🔹 Frontend Setup
cd frontend
npm install
npm start

## 🧪 Testing

- Backend tested using Postman  
- JWT token required for secured endpoints  

---

## 📈 System Highlights

- Real-time notification system  
- Booking conflict prevention logic  
- Resource status automation  
- Role-based authorization  
- Clean architecture (Controller → Service → Repository)  
- DTO validation using `@Valid`  

---

## 🚀 Future Enhancements

- Real-time push notifications (WebSockets)  
- Mobile responsiveness  
- AI-based predictions  
- Advanced analytics  

---

## 📜 License

Academic Project – IT3030 PAF Assignment (2026)




