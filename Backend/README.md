# Language Learning App

A production-ready Node.js server for a language learning app.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/language-learning-app
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### User Endpoints

#### Get All Users

```bash
curl -X GET http://localhost:3000/api/users
```

#### Get User by ID

```bash
curl -X GET http://localhost:3000/api/users/:id
```

#### Create a New User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

#### Update User

```bash
curl -X PUT http://localhost:3000/api/users/:id \
  -H "Content-Type: application/json" \
  -d '{"username": "updateduser", "email": "updated@example.com"}'
```

#### Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/:id
```

### Authentication Endpoints

#### Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "newuser", "email": "new@example.com", "password": "newpassword123"}'
```

#### Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "new@example.com", "password": "newpassword123"}'
```

### User Profile Endpoints

#### Get All User Profiles

```bash
curl -X GET http://localhost:3000/api/profiles
```

#### Get User Profile by ID

```bash
curl -X GET http://localhost:3000/api/profiles/:id
```

#### Create a New User Profile

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_id", "firstName": "John", "lastName": "Doe", "age": 30, "gender": "Male", "nativeLanguage": "English", "interestedLanguages": ["Spanish", "French"], "proficiency": {"language": "Spanish", "level": "Intermediate"}, "motivation": "Travel", "dailyGoal": "Learn 10 new words"}'
```

#### Update User Profile

```bash
curl -X PUT http://localhost:3000/api/profiles/:id \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Jane", "lastName": "Doe"}'
```

#### Delete User Profile

```bash
curl -X DELETE http://localhost:3000/api/profiles/:id
```

## License

MIT
