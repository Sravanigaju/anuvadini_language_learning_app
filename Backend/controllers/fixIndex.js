// fixIndex.js
use("anuvadini_language");

const indexes = db.users.getIndexes();
print("Existing Indexes:", JSON.stringify(indexes, null, 2));

// Drop old index if exists
try {
  db.users.dropIndex("phoneNumber_1");
  print("Dropped old index: phoneNumber_1");
} catch (err) {
  print("No existing phoneNumber_1 index found, skipping...");
}

// Recreate with sparse:true
db.users.createIndex(
  { phoneNumber: 1 },
  { unique: true, sparse: true }
);

print("✅ phoneNumber index recreated with sparse:true");
