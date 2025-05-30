const request = require("supertest");
const { app, server } = require("../index");

describe("API Endpoints", () => {
  let userId;
  let profileId;

  // Test user registration
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  // Test user login
  it("should login a user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  // Test get all users
  it("should get all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    userId = res.body[0]._id;
  });

  // Test get user by ID
  it("should get user by ID", async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", userId);
  });

  // Test create user profile
  it("should create a user profile", async () => {
    const res = await request(app)
      .post("/api/profiles")
      .send({
        userId: userId,
        firstName: "John",
        lastName: "Doe",
        age: 30,
        gender: "Male",
        nativeLanguage: "English",
        interestedLanguages: ["Spanish", "French"],
        proficiency: {
          language: "Spanish",
          level: "Intermediate",
        },
        motivation: "Travel",
        dailyGoal: "Learn 10 new words",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    profileId = res.body._id;
  });

  // Test get all user profiles
  it("should get all user profiles", async () => {
    const res = await request(app).get("/api/profiles");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test get user profile by ID
  it("should get user profile by ID", async () => {
    const res = await request(app).get(`/api/profiles/${profileId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", profileId);
  });

  // Test update user profile
  it("should update user profile", async () => {
    const res = await request(app).put(`/api/profiles/${profileId}`).send({
      firstName: "Jane",
      lastName: "Doe",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("firstName", "Jane");
  });

  // Test delete user profile
  it("should delete user profile", async () => {
    const res = await request(app).delete(`/api/profiles/${profileId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "User profile deleted successfully"
    );
  });

  // Test delete user
  it("should delete user", async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");
  });

  // Close server after tests
  afterAll((done) => {
    server.close(done);
  });
});
