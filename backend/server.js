import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// CORS configuration - FIXED to include port 5173
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Debug environment variables
console.log("=== Environment Check ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
console.log("========================");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "CorpHunt API is running...",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin"
    },
    availableRoutes: [
      "GET /",
      "GET /api/test",
      "POST /api/auth/signup",
      "POST /api/auth/verify-otp",
      "POST /api/auth/resend-otp",
      "POST /api/auth/login"
    ]
  });
});

// Test route to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    timestamp: new Date().toISOString(),
    cors: "enabled for localhost:5173"
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  console.error("Stack trace:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: "Route not found",
    requestedRoute: `${req.method} ${req.path}`,
    availableRoutes: [
      "GET /",
      "GET /api/test",
      "GET /api/health",
      "POST /api/auth/signup",
      "POST /api/auth/verify-otp",
      "POST /api/auth/resend-otp",
      "POST /api/auth/login",
      "GET /api/admin/users",
      "POST /api/admin/users",
      "PUT /api/admin/users/:id",
      "DELETE /api/admin/users/:id"
    ],
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection with better error handling
mongoose
  .connect(process.env.MONGO_URI, {
    // Modern MongoDB connection options (remove deprecated ones)
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected successfully");
    console.log("✅ Database name:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.error("❌ Make sure MongoDB is running and the connection string is correct");
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️ Received SIGINT. Graceful shutdown...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("🚀 ==============================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🚀 Frontend URLs allowed:`);
  console.log(`   - http://localhost:3000`);
  console.log(`   - http://localhost:5173`);
  console.log("🚀 ==============================");
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

export default app;