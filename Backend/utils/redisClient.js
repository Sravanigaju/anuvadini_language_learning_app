// backend/utils/redisClient.js
const redis = require("redis");

const client = redis.createClient(); // Connects to localhost:6379

client.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Redis failed to connect:", err);
  }
})();

module.exports = client;
