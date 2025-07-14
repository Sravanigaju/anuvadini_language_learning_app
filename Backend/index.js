const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for game functionality
}));
app.use(morgan("dev"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/anuvadini_language",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// General API routes (e.g., /api/gamers)
const routes = require("./routes");
app.use("/api", routes);

// Serve Skribble game HTML
app.get('/skribble', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get Skribble game URL
app.get('/api/skribble-url', (req, res) => {
  // Return the URL based on environment
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL || req.protocol + '://' + req.get('host')
    : 'http://localhost:' + PORT;
  
  res.json({
    url: `${baseUrl}/skribble`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// WebSocket init for main server
const { setupWebSocket } = require("./server");

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  setupWebSocket(server); // Setup main WebSocket
  
  // Initialize Skribble server
  const { startServer } = require('./skribbleserver');
  startServer(server); // Pass the same server instance to Skribble
  console.log(`🎮 Skribble game server initialized`);
});

// Export for testing
module.exports = { app, server };