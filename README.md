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

### 🛠️ **Technology Stack**

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **AI**: Google Gemini 2.5 Flash API
- **Weather**: WeatherAPI.com
- **Deployment**: Vercel (Frontend) + Render (Backend)

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
- ✅ Fast loading with optimized performance

## 🏗️ Project Structure

```
KhetSetu/
├── backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   │   ├── aiController.ts       # Gemini AI integration
│   │   │   ├── authController.ts     # Authentication logic
│   │   │   ├── farmController.ts     # Farm management
│   │   │   └── weatherController.ts  # Weather API
│   │   ├── models/         # MongoDB data models
│   │   │   ├── User.ts              # User schema
│   │   │   ├── Farm.ts              # Farm schema
│   │   │   └── CropAdvisory.ts      # Advisory schema
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── config/         # Database & logging config
│   │   └── server.ts       # Main server entry point
│   ├── .env               # Backend environment variables
│   └── package.json       # Backend dependencies
├── frontend/               # React Web Application
│   ├── src/
│   │   ├── components/     # React UI components
│   │   │   ├── Dashboard.tsx        # Main dashboard
│   │   │   ├── Chatbot.tsx          # AI chatbot
│   │   │   ├── FarmVisualization.tsx # Farm management
│   │   │   └── ...
│   │   ├── contexts/      # React context providers
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   ├── ThemeContext.tsx     # Dark mode
│   │   │   └── LanguageContext.tsx  # i18n
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

#### 2. Set up MongoDB Atlas

- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free M0 cluster
- Create database user and get connection string
- Whitelist your IP address (or use 0.0.0.0/0 for development)

#### 3. Get API Keys

**Gemini AI API:**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Select "Create API key in new project"
4. Copy the API key

**Weather API:**

1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Get your free API key from the dashboard

#### 4. Configure Backend

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

#### 5. Configure Frontend

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

#### 6. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

#### 7. Access the Application

Open your browser and navigate to `http://localhost:5173`

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
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
```

### Farm Management Endpoints

```
GET    /api/farms                  # Get all user farms
POST   /api/farms                  # Create new farm
GET    /api/farms/:id              # Get farm by ID
PUT    /api/farms/:id              # Update farm
DELETE /api/farms/:id              # Delete farm
POST   /api/farms/:id/plots        # Add plot to farm
PUT    /api/farms/:id/plots/:num   # Update plot
DELETE /api/farms/:id/plots/:num   # Delete plot
```

### AI Endpoints

```
POST   /api/ai/chat                # Chat with AI assistant
POST   /api/ai/crop-advisory       # Get crop recommendations
POST   /api/ai/pest-identify       # Identify pest from image
POST   /api/ai/soil-analysis       # Analyze soil conditions
GET    /api/ai/status              # Check AI service status
```

### Weather Endpoints

```
GET    /api/weather/current?location=  # Current weather
GET    /api/weather/forecast?location= # Weather forecast
```

### Market Endpoints

```
GET    /api/market/prices          # Get crop prices
GET    /api/market/trends          # Get market trends
```

## 🔧 Development

### Available Scripts

**Backend:**

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm test           # Run tests
```

**Frontend:**

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Mongoose** for data validation

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Environment Variables for Vercel:**

```
VITE_API_URL=https://khetsetu.onrender.com/api
VITE_BACKEND_URL=https://khetsetu.onrender.com/api
VITE_GEMINI_API_KEY=your_key
VITE_WEATHER_API_KEY=your_key
VITE_APP_ENV=production
```

### Backend (Render)

1. Create new Web Service in Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables

**Environment Variables for Render:**

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_key
WEATHER_API_KEY=your_key
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
CORS_ORIGIN=https://khetsetu.vercel.app
```

## 🐛 Troubleshooting

### Common Issues

**1. Gemini API Not Working**

- Ensure API key is correct
- Check if Generative Language API is enabled in Google Cloud
- Model name should be `gemini-2.5-flash` (not `gemini-pro`)

**2. MongoDB Connection Failed**

- Verify connection string is correct
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

**3. CORS Errors**

- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches exactly

**4. Weather API 403 Error**

- Verify API key is valid
- Check if you've exceeded free tier limits

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
| Mobile Responsive   | ✅ Complete | All screen sizes            |

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
- Vercel & Render for deployment

---

**Made with ❤️ for farmers**

**KhetSetu** is a comprehensive Smart Agricultural Platform designed to revolutionize farming through technology. It provides farmers with AI-powered insights, crop management tools, weather monitoring, market linkage, and data-driven decision making capabilities.

## 🚀 Features

### 🌱 **Core Agricultural Features**

- **Farm Management** - Digital farm profiles with location mapping
- **Crop Tracking** - Monitor crop growth stages and health
- **AI-Powered Advice** - Smart recommendations using Gemini AI
- **Weather Integration** - Real-time weather data and forecasts
- **Market Linkage** - Current crop prices and market trends
- **Pest & Disease Detection** - Image-based diagnosis and treatment

### 🛠️ **Technology Stack**

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication with refresh tokens
- **AI Integration**: Google Gemini AI for smart recommendations
- **Deployment**: Production-ready with Docker support

### 🔐 **Authentication System**

- **User Registration** - Multi-step registration with profile setup
- **Secure Login** - JWT-based authentication with automatic token refresh
- **User Profiles** - Comprehensive farmer profiles with location and farm data
- **Password Management** - Secure password reset via email
- **Role-based Access** - Support for farmers, advisors, and administrators
- **Session Management** - Automatic logout and token cleanup

### 📱 **User Experience**

- **Responsive Design** - Works seamlessly on mobile and desktop
- **Dark Mode Support** - Toggle between light and dark themes with system preference detection
- **Multi-language Support** - Hindi and English support
- **Offline Capability** - Core features work without internet
- **Real-time Updates** - Live data synchronization
- **Intuitive Interface** - Farmer-friendly design

## 🏗️ Project Structure

```
KhetSetu/
├── backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # MongoDB data models
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Authentication, validation
│   │   ├── config/         # Database, logging configuration
│   │   └── server.ts       # Main server entry point
├── backend/                 # Node.js/Express API Server
│   ├── .env               # Backend environment variables
│   └── package.json       # Backend dependencies
├── frontend/               # React Web Application
│   ├── .env               # Frontend environment variables
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React context providers
│   │   ├── utils/         # Utility functions, API calls
│   │   └── App.tsx        # Main React application
│   └── package.json       # Frontend dependencies
├── docs/                   # Documentation
│   ├── development-guide.md # Development roadmap
│   └── authentication.md  # Authentication system details
└── scripts/               # Utility scripts
    └── simple-test.sh     # API testing script
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 7.0+
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/khetsetu.git
cd khetsetu
```

2. **Set up MongoDB Atlas**

- Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free M0 cluster
- Create database user and get connection string

3. **Configure Backend**

```bash
cd backend
npm install
# Create .env file in backend directory with your MongoDB Atlas connection string
```

**Required Environment Variables:**

```env
# MongoDB Atlas Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/khetsetu?retryWrites=true&w=majority

# JWT Authentication (generate secure random strings)
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_minimum_32_characters_long
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173
```

4. **Configure Frontend**

```bash
cd ../frontend
npm install
# .env file is automatically created with default values
```

**Frontend Environment (.env):**

```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start Development Servers**

**Start Servers Separately**

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

6. **Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🔐 Authentication System

KhetSetu includes a complete authentication system with user registration, login, profile management, and secure session handling.

### First Time Setup

1. **Start the servers** using the instructions above
2. **Open the frontend** at http://localhost:5173
3. **Register a new account** using the registration form
4. **Complete your profile** with farm details (optional)
5. **Start using the platform** with your authenticated account

### User Registration Process

The registration is a 3-step process:

1. **Basic Information**: Name, email, password, phone (optional)
2. **Location Details**: State, district, village, preferred language
3. **Farm Details**: Farm size, soil type, experience, primary crops (optional)

### Features Included

- ✅ **Secure Registration** with validation
- ✅ **JWT-based Authentication** with automatic token refresh
- ✅ **Password Management** (change password, forgot password)
- ✅ **User Profile Management** with farm details
- ✅ **Multi-language Support** (English/Hindi)
- ✅ **Role-based Access** (farmer, advisor, admin)
- ✅ **Session Persistence** across browser sessions
- ✅ **Automatic Logout** on token expiration

### Testing Authentication

Test the authentication system:

```bash
# Install test dependencies
npm install -g axios colors

# Run authentication tests
node scripts/test-auth-api.js
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Farm Management

- `GET /api/farms` - List user's farms
- `POST /api/farms` - Create new farm
- `GET /api/farms/:id` - Get farm details
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Crop Management

- `GET /api/crops` - List crops
- `POST /api/crops` - Add new crop
- `GET /api/crops/:id` - Get crop details
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### AI & Analytics

- `POST /api/ai/advice` - Get AI farming advice
- `POST /api/ai/disease-detection` - Disease detection from images
- `GET /api/analytics/dashboard` - Dashboard analytics

### External Data

- `GET /api/weather` - Weather information
- `GET /api/market/prices` - Market prices
- `GET /api/health` - System health check

## 🧪 Testing

### Run API Tests

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test all endpoints with provided script
./scripts/simple-test.sh
```

### Test Credentials

- **Email**: `rajesh.farmer@example.com`
- **Password**: `FarmingLife123!`

## 🚀 Deployment

> **⚠️ IMPORTANT**: If you're experiencing double slash issues in URLs (like `https://domain.com//auth/login`), see the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for the complete fix.

### Quick Fix for Vercel Double Slash Issue

If your authentication URLs show double slashes, fix it by:

1. **Go to Vercel Dashboard → Settings → Environment Variables**
2. **Set:** `VITE_API_URL` = `https://khetsetu-backend.onrender.com/api` (NO trailing slash)
3. **Redeploy your frontend**

### Production Environment

```bash
# Build applications
cd backend && npm run build
cd frontend && npm run build

# Start production server
cd backend && npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Detailed Deployment Guide

For complete deployment instructions, troubleshooting, and environment setup, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Environment Variables

**Backend (backend/.env)**

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/khetsetu-prod?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
JWT_REFRESH_SECRET=your-secure-refresh-secret-minimum-32-chars
GEMINI_API_KEY=your-gemini-api-key
WEATHER_API_KEY=your-weather-api-key-from-weatherapi.com
```

**Frontend (frontend/.env)**

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_WEATHER_API_KEY=your-weather-api-key-from-weatherapi.com
```

### Weather API Setup

The weather functionality uses [WeatherAPI.com](https://www.weatherapi.com/) for real-time weather data:

1. Sign up for a free account at [WeatherAPI.com](https://www.weatherapi.com/)
2. Get your API key from the dashboard
3. Add it to your environment variables as `VITE_WEATHER_API_KEY`
4. The weather widget will automatically use the user's location from their profile
5. Fallback location is set to "Delhi, India" if no user location is available

**Weather Features:**

- Current weather conditions with temperature, humidity, wind speed
- 4-day weather forecast
- Weather alerts and warnings
- Agricultural insights (irrigation recommendations, pest risk assessment)
- UV index monitoring for farm worker safety

````

## 📚 Documentation

- **[Development Guide](docs/development-guide.md)** - Development roadmap
- **[Authentication Guide](docs/authentication.md)** - Authentication system details
- **[API Documentation](http://localhost:5000/api/docs)** - Interactive API docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Ensure mobile responsiveness
- Test with real agricultural data

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run type-check   # TypeScript type checking
npm run lint         # Run ESLint
````

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation and sanitization
- Environment variable protection

## 🌟 Key Technologies

| Category     | Technology    | Purpose               |
| ------------ | ------------- | --------------------- |
| **Frontend** | React 18      | Modern UI framework   |
| **Styling**  | Tailwind CSS  | Utility-first CSS     |
| **Backend**  | Express.js    | Web framework         |
| **Database** | MongoDB       | Document database     |
| **Language** | TypeScript    | Type safety           |
| **AI**       | Google Gemini | Smart recommendations |
| **Build**    | Vite          | Fast build tool       |
| **Auth**     | JWT           | Secure authentication |

## 📱 Mobile Support

KhetSetu is designed mobile-first for farmers in the field:

- Touch-friendly interface
- Offline data synchronization
- Camera integration for crop monitoring
- GPS location tracking
- Progressive Web App (PWA) capabilities

## 🌍 Localization

- **English** - Full support
- **Hindi** - UI and content localization
- **Regional Languages** - Extensible for local dialects

## 📈 Analytics & Monitoring

- User engagement tracking
- Crop performance analytics
- Weather pattern analysis
- Market trend monitoring
- System health monitoring

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/khetsetu/issues)
- **Documentation**: [Project Wiki](https://github.com/yourusername/khetsetu/wiki)
- **Community**: [Discussions](https://github.com/yourusername/khetsetu/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Farmers** - For inspiring this platform
- **Google Gemini AI** - For AI capabilities
- **MongoDB** - For reliable data storage
- **React Team** - For the amazing framework
- **Open Source Community** - For incredible tools and libraries

## 🔮 Roadmap

### Phase 1 (Current) ✅

- Core farm and crop management
- Basic AI recommendations
- User authentication
- Mobile-responsive design

### Phase 2 (Next Quarter)

- IoT sensor integration
- Advanced disease detection
- Market price predictions
- Farmer community features

### Phase 3 (Future)

- Drone integration
- Satellite imagery analysis
- Financial services integration
- Equipment marketplace

---

**Made with ❤️ for farmers by the KhetSetu team**

_Empowering agriculture through technology_ 🌾

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Powered by MongoDB](https://img.shields.io/badge/Powered%20by-MongoDB-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![AI by Gemini](https://img.shields.io/badge/AI%20by-Gemini-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
