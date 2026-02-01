# 🌾 KhetSetu - Smart Agricultural Platform

![KhetSetu Logo](https://img.shields.io/badge/KhetSetu-Smart%20Agriculture-green?style=for-the-badge&logo=leaf)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://khetsetu.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Live-blue?style=for-the-badge)](https://khetsetu.onrender.com)

**KhetSetu** is a comprehensive Smart Agricultural Platform designed to revolutionize farming through technology. It provides farmers with AI-powered insights, crop management tools, weather monitoring, market linkage, and data-driven decision making capabilities.

## 🌐 Live Deployment

- **Frontend**: [https://khetsetu.vercel.app](https://khetsetu.vercel.app)
- **Backend API**: [https://khetsetu.onrender.com](https://khetsetu.onrender.com)
- **Database**: MongoDB Atlas (Cloud)

## 🚀 Features

### 🌱 **Core Agricultural Features**

- ✅ **Farm Management** - Digital farm profiles with location mapping
- ✅ **Crop Tracking** - Monitor crop growth stages and health
- ✅ **AI-Powered Chatbot** - Smart farming advice using Gemini 2.5 Flash
- ✅ **Weather Integration** - Real-time weather data and 4-day forecasts
- ✅ **Market Linkage** - Current crop prices and market trends
- ✅ **Pest & Disease Detection** - AI-based image diagnosis
- ✅ **Soil Analysis** - AI-powered soil health recommendations
- ✅ **Crop Advisory** - Personalized crop recommendations

### 🔐 **Authentication System**

- ✅ User Registration with profile setup
- ✅ Secure JWT-based authentication
- ✅ Automatic token refresh
- ✅ Password reset functionality
- ✅ Role-based access control
- ✅ Session management

### 📱 **User Experience**

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Dark mode with system preference detection
- ✅ Multi-language support (Hindi & English)
- ✅ Real-time data synchronization
- ✅ Intuitive farmer-friendly interface

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **AI**: Google Gemini 2.5 Flash API
- **Weather**: WeatherAPI.com
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 🏗️ Project Structure

```
KhetSetu/
├── backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # MongoDB data models
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── config/         # Database & logging config
│   │   └── server.ts       # Main server entry point
│   ├── .env               # Backend environment variables
│   └── package.json       # Backend dependencies
├── frontend/               # React Web Application
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── contexts/      # React context providers
│   │   ├── services/      # API client services
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main React application
│   ├── .env               # Frontend environment variables
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key
- WeatherAPI.com API key

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/MeetThakur/Khetsetu.git
cd Khetsetu
```

#### 2. Configure Backend

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:

```env
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/khetsetu?retryWrites=true&w=majority

# JWT Secrets (generate secure random strings)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=your_weather_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 3. Configure Frontend

```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000/api

# API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_WEATHER_API_KEY=your_weather_api_key_here

# App Settings
VITE_APP_ENV=development
VITE_DEBUG=true
```

#### 4. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://khetsetu.onrender.com/api`

### Authentication Endpoints

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/refresh-token     # Refresh access token
POST   /api/auth/logout            # Logout user
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update profile
```

### Farm Management Endpoints

```
GET    /api/farms                  # Get all user farms
POST   /api/farms                  # Create new farm
GET    /api/farms/:id              # Get farm by ID
PUT    /api/farms/:id              # Update farm
DELETE /api/farms/:id              # Delete farm
```

### AI Endpoints

```
POST   /api/ai/chat                # Chat with AI assistant
POST   /api/ai/crop-advisory       # Get crop recommendations
POST   /api/ai/pest-identify       # Identify pest from image
POST   /api/ai/soil-analysis       # Analyze soil conditions
```

## 🔧 Development Scripts

**Backend:**

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

**Frontend:**

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables: `VITE_API_URL`, `VITE_GEMINI_API_KEY`, `VITE_WEATHER_API_KEY`
4. Deploy

### Backend (Render)

1. Create new Web Service in Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables: `NODE_ENV`, `MONGODB_URI`, `GEMINI_API_KEY`, etc.

## 📊 Features Status

| Feature             | Status      | Notes                       |
| ------------------- | ----------- | --------------------------- |
| User Authentication | ✅ Complete | JWT with refresh tokens     |
| Farm Management     | ✅ Complete | Full CRUD operations        |
| AI Chatbot          | ✅ Complete | Gemini 2.5 Flash            |
| Crop Advisory       | ✅ Complete | AI-powered recommendations  |
| Weather Integration | ✅ Complete | Real-time + forecasts       |
| Market Prices       | ✅ Complete | Live price data             |
| Pest Detection      | ✅ Complete | Image-based AI detection    |
| Soil Analysis       | ✅ Complete | AI recommendations          |
| Dark Mode           | ✅ Complete | System preference detection |
| Multi-language      | ✅ Complete | Hindi & English             |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Meet Thakur**

- GitHub: [@MeetThakur](https://github.com/MeetThakur)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent recommendations
- WeatherAPI.com for weather data
- MongoDB Atlas for database hosting
