# MedPlus - Hospital Management System

A comprehensive, full-stack hospital management system built with FastAPI (backend) and React (frontend). MedPlus streamlines hospital operations including patient appointments, doctor consultations, prescription management, and pharmacy dispensing.

## 🌟 Features

### Patient Portal

- 📅 **Appointment Booking** - Book appointments with doctors by specialization
- 📋 **Appointment Management** - View, track, and cancel appointments
- 💬 **AI Chatbot Assistant** - Get help booking appointments and navigating the system
- 🔔 **Real-time Updates** - Track appointment status and token numbers

### Doctor Portal

- 👥 **Patient Queue Management** - View today's appointments in token order
- 💊 **Prescription Creation** - Create detailed prescriptions with multiple medicines
- ✅ **Appointment Completion** - Mark consultations as complete
- 📊 **Patient History** - Access patient information and appointment details

### Pharmacy Portal

- 📦 **Pending Prescriptions** - View all prescriptions awaiting dispensing
- 💰 **Billing & Dispensing** - Process prescriptions and generate bills
- 📋 **Prescription Details** - View complete medicine information (dosage, frequency, duration)

### Admin Portal

- 📊 **Dashboard Analytics** - View hospital statistics and metrics
- 👨‍⚕️ **Doctor Management** - Add, view, and remove doctors
- 👨‍💼 **Staff Management** - Manage pharmacists and other staff
- 📈 **System Overview** - Monitor appointments, prescriptions, and overall operations

## 🛠️ Technology Stack

### Backend

- **Framework:** FastAPI 0.104.1
- **Database:** SQLite with SQLAlchemy ORM
- **Authentication:** JWT tokens with python-jose
- **Password Hashing:** bcrypt 4.1.2
- **Validation:** Pydantic 2.12.5
- **Server:** Uvicorn ASGI server

### Frontend

- **Framework:** React 19.2.0
- **Routing:** React Router DOM 7.1.3
- **Styling:** TailwindCSS 4.1.18
- **HTTP Client:** Axios 1.6.7
- **Icons:** Lucide React 0.344.0
- **Build Tool:** Vite 6.4.1

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** (Python 3.13 recommended)
- **Node.js 18+** and npm
- **Git** (optional, for cloning)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
cd d:\MedPlus
```

### 2. Backend Setup

#### Step 1: Navigate to backend directory

```bash
cd backend
```

#### Step 2: Create virtual environment

```bash
python -m venv .venv
```

#### Step 3: Activate virtual environment

```bash
# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate
```

#### Step 4: Install dependencies

```bash
pip install -r requirements.txt
```

#### Step 5: Seed the database

```bash
python seed.py
```

This will create the `medplus.db` SQLite database and populate it with test data.

#### Step 6: Start the backend server

```bash
uvicorn main:app --reload
```

The backend API will be available at: **http://localhost:8000**

API Documentation (Swagger UI): **http://localhost:8000/docs**

### 3. Frontend Setup

#### Step 1: Navigate to frontend directory (in a new terminal)

```bash
cd d:\MedPlus\frontend
```

#### Step 2: Install dependencies

```bash
npm install --legacy-peer-deps
```

#### Step 3: Start the development server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## 🔐 Test Credentials

Use these credentials to login and test different user roles:

| Role           | Email               | Password   |
| -------------- | ------------------- | ---------- |
| **Patient**    | patient@medplus.com | patient123 |
| **Doctor**     | doctor@medplus.com  | doctor123  |
| **Pharmacist** | pharma@medplus.com  | pharma123  |
| **Admin**      | admin@medplus.com   | admin123   |

## 📁 Project Structure

```
MedPlus/
├── backend/
│   ├── main.py              # FastAPI application & API endpoints
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── auth.py              # JWT authentication & authorization
│   ├── db.py                # Database configuration
│   ├── seed.py              # Database seeding script
│   ├── requirements.txt     # Python dependencies
│   └── medplus.db           # SQLite database (created after seeding)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js     # Axios HTTP client configuration
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── Topbar.jsx           # Top navigation bar
│   │   │   ├── StatCard.jsx         # Statistics card component
│   │   │   ├── ProtectedRoute.jsx   # Route protection wrapper
│   │   │   └── ChatbotWidget.jsx    # AI chatbot assistant
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Landing/home page
│   │   │   ├── Login.jsx            # Login & signup page
│   │   │   └── dashboards/
│   │   │       ├── PatientDashboard.jsx
│   │   │       ├── DoctorDashboard.jsx
│   │   │       ├── PharmacyDashboard.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # TailwindCSS imports
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Node dependencies
│
└── README.md                # This file
```

## 🗄️ Database Schema

### Tables

- **users** - User accounts (all roles)
- **doctors** - Doctor-specific information
- **patients** - Patient-specific information
- **pharmacists** - Pharmacist-specific information
- **appointments** - Appointment bookings
- **prescriptions** - Doctor prescriptions
- **prescription_items** - Individual medicines in prescriptions
- **dispensary_records** - Pharmacy dispensing records

## 🔌 API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Patient Endpoints

- `POST /patient/appointments` - Book appointment
- `GET /patient/appointments` - Get patient's appointments
- `DELETE /patient/appointments/{id}` - Cancel appointment

### Doctor Endpoints

- `GET /doctor/appointments` - Get today's appointment queue
- `PUT /doctor/appointments/{id}/complete` - Mark appointment complete
- `POST /doctor/prescriptions` - Create prescription

### Pharmacy Endpoints

- `GET /pharmacy/prescriptions` - Get pending prescriptions
- `POST /pharmacy/dispense` - Dispense prescription

### Admin Endpoints

- `GET /admin/stats` - Get hospital statistics
- `GET /admin/doctors` - Get all doctors
- `DELETE /admin/doctors/{id}` - Delete doctor
- `GET /admin/pharmacists` - Get all pharmacists

### Public Endpoints

- `GET /doctors` - Get all doctors (public)
- `POST /chatbot/message` - Chatbot interaction

## 🎨 UI Features

- **Modern Gradient Design** - Beautiful gradient backgrounds and cards
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Hover effects and transitions
- **Dark Sidebar** - Professional gradient sidebar navigation
- **Modal Dialogs** - Clean modals for booking and prescriptions
- **Real-time Chatbot** - Floating chatbot widget with typing indicators

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API endpoints
- Automatic token refresh
- CORS configuration

## 🚧 Development

### Backend Development

```bash
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
cd frontend
npm run build
```

## 📝 Common Commands

### Reset Database

```bash
cd backend
python seed.py
```

### Install New Python Package

```bash
cd backend
.venv\Scripts\activate
pip install package-name
pip freeze > requirements.txt
```

### Install New Node Package

```bash
cd frontend
npm install package-name --legacy-peer-deps
```

## 🐛 Troubleshooting

### Backend Issues

**Issue:** `ModuleNotFoundError: No module named 'sqlalchemy'`

```bash
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
```

**Issue:** Database errors

```bash
# Delete the database and reseed
cd backend
Remove-Item medplus.db
python seed.py
```

### Frontend Issues

**Issue:** `npm install` fails with dependency conflicts

```bash
npm install --legacy-peer-deps
```

**Issue:** Vite build errors

```bash
# Clear node_modules and reinstall
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install --legacy-peer-deps
```

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API documentation at http://localhost:8000/docs
3. Check browser console for frontend errors
4. Check terminal logs for backend errors

## 📄 License

This project is for educational and demonstration purposes.

## 👥 Contributors

Developed as a comprehensive hospital management system demonstration.

---

**MedPlus** - Streamlining Healthcare Operations 🏥✨
