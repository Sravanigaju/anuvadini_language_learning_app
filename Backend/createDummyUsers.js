const mongoose = require("mongoose");
const User = require("./models/user1");  // ✅ correct if your file is user1.js

const bcrypt = require("bcrypt");

async function createDummyUser(i) {
  const email = `user${i}@example.com`;
  const phoneNumber = `900000000${i}`; // unique phone number for each user
  const username = `dummyuser${i}`;
  const passwordPlain = `password${i}`;
  const hashedPassword = await bcrypt.hash(passwordPlain, 10);

  const newUser = new User({
    username,
    phoneNumber,
    email,
    password: hashedPassword,
    role: "user",
    isVerified: true,
  });

  await newUser.save();
  console.log(`Created user: ${email}`);
}

async function main() {
  await mongoose.connect("mongodb://localhost:27017/anuvadini_language");

  for (let i = 1; i <= 5; i++) {  // create 5 dummy users
    await createDummyUser(i);
  }

  mongoose.disconnect();
}

main().catch(console.error);
