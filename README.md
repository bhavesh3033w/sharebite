# 🍱 ShareBite — Share Food, Share Kindness

A full-stack MERN social impact platform connecting **Donors**, **NGOs**, and **Volunteers** for food and clothing donations.

---

## 🧱 Tech Stack

| Layer     | Tech                                       |
|-----------|--------------------------------------------|
| Frontend  | React 18, React Router v6, Tailwind CSS    |
| Backend   | Node.js, Express.js                        |
| Database  | MongoDB + Mongoose                         |
| Auth      | JWT + bcrypt                               |
| UI/UX     | react-hot-toast, Unsplash images           |

---

## 📁 Project Structure

```
sharebite/
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── ProtectedRoute.js
│       │   ├── Spinner.js
│       │   └── StatusBadge.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── auth/
│       │   │   ├── Login.js
│       │   │   └── Signup.js
│       │   └── dashboards/
│       │       ├── donor/DonorDashboard.js
│       │       ├── ngo/NgoDashboard.js
│       │       └── volunteer/VolunteerDashboard.js
│       ├── services/
│       │   └── api.js
│       ├── App.js
│       ├── index.js
│       └── index.css
│
└── server/                   # Node + Express backend
    ├── controllers/
    │   ├── authController.js
    │   ├── donationController.js
    │   └── volunteerController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── User.js
    │   ├── Donation.js
    │   └── Volunteer.js
    ├── routes/
    │   ├── auth.js
    │   ├── donations.js
    │   └── volunteers.js
    ├── index.js
    └── .env.example
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local install or [MongoDB Atlas](https://cloud.mongodb.com) free tier)
- npm or yarn

---

### 1. Clone / Extract the project

```bash
cd sharebite
```

---

### 2. Set up the Backend

```bash
cd server
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sharebite
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

> **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/sharebite`

Start the server:
```bash
npm run dev     # development (with nodemon)
# OR
npm start       # production
```

Server runs at: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

---

### 3. Set up the Frontend

```bash
cd ../client
npm install
```

Create `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:
```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔐 Role-Based Access

| Role      | Login Redirect        | Permissions                          |
|-----------|----------------------|--------------------------------------|
| Donor     | `/donor-dashboard`   | Submit donations, view own history   |
| NGO       | `/ngo-dashboard`     | View all donations, accept/reject, view volunteers |
| Volunteer | `/volunteer-dashboard` | Register profile with skills       |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|---------------------|--------------------|
| POST   | `/api/auth/signup`  | Register new user  |
| POST   | `/api/auth/login`   | Login & get JWT    |

### Donations
| Method | Endpoint                | Auth     | Role        | Description               |
|--------|------------------------|----------|-------------|---------------------------|
| POST   | `/api/donations`       | Required | Donor       | Create new donation        |
| GET    | `/api/donations`       | Required | Any         | Get donations (filtered)  |
| PUT    | `/api/donations/:id`   | Required | NGO         | Update donation status     |

### Volunteers
| Method | Endpoint              | Auth     | Role      | Description              |
|--------|-----------------------|----------|-----------|--------------------------|
| POST   | `/api/volunteers`     | Required | Volunteer | Register as volunteer    |
| GET    | `/api/volunteers`     | Required | NGO       | View all volunteers      |

---

## 🎨 Design System

```
Primary Orange:  #FF6B35
Trust Teal:      #2EC4B6
Soft Cream bg:   #FFF7F2
Text Dark:       #2D2D2D
Text Light:      #6B7280

Status:
  Pending  → #FACC15 (yellow)
  Accepted → #22C55E (green)
  Rejected → #EF4444 (red)
```

---

## 🚀 Production Deployment

### Backend (Railway / Render)
1. Push `server/` to GitHub
2. Connect to Railway or Render
3. Set env vars: `MONGO_URI`, `JWT_SECRET`, `PORT`

### Frontend (Vercel / Netlify)
1. Push `client/` to GitHub
2. Connect to Vercel
3. Set env var: `REACT_APP_API_URL=https://your-api.railway.app/api`
4. Build command: `npm run build`

---

## 📸 Screenshots

### Homepage
- Warm food-inspired hero with Unsplash image
- Stats banner, features grid, CTA

### Donor Dashboard
- Stats cards (total, accepted, pending, rejected)
- Inline donation form
- Donation history with status badges

### NGO Dashboard
- Dark sidebar admin panel
- Donation management with Accept/Reject buttons
- Volunteer directory

### Volunteer Dashboard
- Teal-themed friendly UI
- Registration form
- How-to-help cards

---

## 🛡️ Security Features
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire in 7 days
- Role-based route protection on API
- Frontend route guards (ProtectedRoute component)

---

Made with ❤️ for communities in need.
