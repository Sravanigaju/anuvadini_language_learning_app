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
  contentSecurityPolicy: false, 
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


// ✅ ADD THIS - API PING ENDPOINT (if not already added)
app.get('/api/ping', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ 
    message: 'Backend server online!',
    timestamp: new Date().toISOString(),
    mobile_accessible: true,
    status: 'success'
  });
});

// ✅ ADD THIS TO YOUR ACTUAL BACKEND INDEX.JS
app.get('/api/content/levels', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const levels = await db.collection('levels').find({}).toArray();
    
    console.log(`📚 Serving ${levels.length} levels to sync service`);
    res.json(levels);
  } catch (error) {
    console.error('❌ Error fetching levels:', error);
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
});
// Serve Skribble game HTML
app.get('/skribble', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.get('/privacypolicy', (req, res) => {
  res.sendFile(__dirname + 'html/privacypolicy');
  console.log("11111111111111111111111111");
});

// });

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
const { setupWebSocket } = require("./server"); 
// Start server
const PORT = 3002; // Use a different port to avoid conflicts

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  setupWebSocket(server); // Initialize WebSocket server
  // const { startServer } = require('./skribbleserver');
  // startServer(server); // Pass the same server instance to Skribble
  // console.log(`🎮 Skribble game server initialized`);
});

// Export for testing
module.exports = { app, server };










// // const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const dotenv = require("dotenv");
// const path = require("path");
// const redisClient = require("./utils/redisClient");

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// // app.use(helmet());
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );
// app.use(morgan("dev"));

// // Serve static assets for /_expo
// app.use("/_expo", express.static(path.join(__dirname, "dist/_expo")));

// // Handle GET requests to /_expo/*
// app.get("/_expo/*", (req, res) => {
//   if (req.path.startsWith("/_expo/static/")) {
//     return res.status(404).end();
//   }
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// // Handle POST requests to /_expo/*
// app.post("/_expo/*", (req, res) => {
//   console.log("POST /_expo hit");
//   console.log("Body:", req.body);
//   res.json({ status: "ok", received: req.body });
// });

// /* -------------------- 🔔 Expo Logging + Static -------------------- */

// // Logger for /expo
// app.use("/expo", (req, res, next) => {
//   console.log("🔔 /expo endpoint hit");
//   console.log("URL:", req.originalUrl);
//   console.log("Method:", req.method);
//   console.log("Query:", req.query);
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   console.log("----");
//   next();
// });

// // Serve static files from dist
// app.use("/expo", express.static(path.join(__dirname, "dist")));

// // Always return index.html for React routes
// app.get("/expo/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// app.use(express.static("html"));
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve static files from dist
// app.use("/expo", express.static(path.join(__dirname, "dist")));

// // Always return index.html for React routes
// app.get("/expo/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });


// // Connect to MongoDB
// mongoose
//   .connect(
//     process.env.MONGODB_URI ||
//       "mongodb://127.0.0.1:27017/anuvadini_language",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// const routes = require("./routes");
// app.use("/api", routes)

// // Serve Skribble game HTML
// app.get('/skribble', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'skribble.html'));
// });

// // API endpoint to get Skribble game URL
// app.get('/api/skribble-url', (req, res) => {
//   // Return the URL based on environment
//   const baseUrl = process.env.NODE_ENV === 'production' 
//     ? process.env.BASE_URL || req.protocol + '://' + req.get('host')
//     : 'http://localhost:' + PORT;
  
//   res.json({
//     url: `${baseUrl}/skribble`
//   });
// });
// // Error handling middleware should be after all routes
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// // Catch-all route should be last
// app.use("/*", (req, res) => {
//   console.log("Catch-all route hit");
//   res.status(200).send(`Route: ${req.originalUrl}, Method: ${req.method}`);
// });


// app.get('/privacypolicy', (req, res) => {
//   res.sendFile(__dirname + 'html/privacypolicy');
//   console.log("11111111111111111111111111");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });
// const { setupWebSocket } = require("./server"); 
// // Start server
// const PORT = process.env.PORT || 7273;
// const server = app.listen(PORT,'0.0.0.0', () => {
//   console.log(`Server is running on port ${PORT}`);
//   setupWebSocket(server); // Initialize WebSocket server

//   const { startServer } = require('./skribbleserver');
//   startServer(server); // Pass the same server instance to Skribble
//   console.log('🎮 Skribble game server initialized');
// });



// // Export app for testing
// module.exports = { app, server };
