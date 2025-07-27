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

app.use(express.static("html"));
app.use("/auth", express.static(path.join(__dirname, "admin_main", "build")));
app.get("/auth/*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin_main", "build", "index.html"));
});

mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/anuvadini_language",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes
const routes = require("./routes");
app.use("/api", routes)

// Serve Skribble game HTML
app.get('/skribble', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/privacypolicy', (req, res) => {
  res.sendFile(__dirname + 'html/privacypolicy');
  console.log("11111111111111111111111111");
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Fallback route (should be last)
app.use("/*", (req, res) => {
  console.log("asdasd");
  res.status(200).send(`Route: ${req.originalUrl}, Method: ${req.method}`);
});
const { setupWebSocket } = require("./server"); // Import the WebSocket initializer
// Start server
const PORT = process.env.PORT || 7273;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  setupWebSocket(server); // Initialize WebSocket server
});

// Initialize Skribble server
const { startServer } = require('./skribbleserver');
startServer(server); // Pass the same server instance to Skribble
console.log(`🎮 Skribble game server initialized`);

// Export for testing
module.exports = { app, server };
