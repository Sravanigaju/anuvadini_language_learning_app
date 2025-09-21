# Daily Goal Tracker API Request/Response Flows

This document outlines the complete request/response flows between the frontend and backend for the Daily Goal Tracker feature.

## 🔄 **Complete Flow Mapped to Frontend Variables**

### **1. App Opens / Focus**

#### **Request:**
```http
GET /api/goals/date
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
```

#### **Response:**
```json
{
  "date": "2025-09-19",
  "editable": true,
  "goals": [
    {
      "_id": "64f8a7b9c3d4e5f6a7b8c9d0",
      "title": "Learn 5 new words",
      "color": "#FF6B6B",
      "order": 0,
      "done": false
    },
    {
      "_id": "64f8a7b9c3d4e5f6a7b8c9d1",
      "title": "Complete a vocabulary quiz",
      "color": "#4ECDC4",
      "order": 1,
      "done": true
    }
  ]
}
```

#### **Frontend Variable Mapping:**
```javascript
// Set tasks from API response
const apiTasks = goalsData.goals.map(goal => ({
  id: goal._id,           // goal._id → task.id
  title: goal.title,      // goal.title → task.title
  done: goal.done         // goal.done → task.done
}));
setTasks(apiTasks);

// Set editable state
setIsEditable(goalsData.editable);  // goalsData.editable → isEditable
```

---

#### **Request:**
```http
GET /api/goals/progress
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
```

#### **Response:**
```json
{
  "dates": ["2025-09-13", "2025-09-14", "2025-09-15", "2025-09-16", "2025-09-17", "2025-09-18", "2025-09-19"],
  "counts": [2, 3, 1, 2, 3, 2, 1],
  "totalGoals": 3,
  "completedDaysAll": 2
}
```

#### **Frontend Variable Mapping:**
```javascript
// Set completed daily stages
setCompletedDailyStages(progressData.completedDaysAll);  // progressData.completedDaysAll → completedDailyStages
```

---

### **2. User Taps a Task**

#### **Request:**
```http
POST /api/goals/64f8a7b9c3d4e5f6a7b8c9d0/toggle
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
  - Content-Type: application/json
Body: {}
```

#### **Response:**
```json
{
  "goalId": "64f8a7b9c3d4e5f6a7b8c9d0",
  "date": "2025-09-19",
  "done": true
}
```

#### **Frontend Variable Mapping:**
```javascript
// Update local state based on API response
const newTasks = tasks.map((task) =>
  task.id === id ? { ...task, done: response.done } : task  // response.done → task.done
);
setTasks(newTasks);

// Refresh progress data
const progressData = await fetchGoalProgress();
setCompletedDailyStages(progressData.completedDaysAll);  // progressData.completedDaysAll → completedDailyStages
```

---

### **3. User Views Previous Day**

#### **Request:**
```http
GET /api/goals/date?date=2025-09-18
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
```

#### **Response:**
```json
{
  "date": "2025-09-18",
  "editable": false,
  "goals": [
    {
      "_id": "64f8a7b9c3d4e5f6a7b8c9d0",
      "title": "Learn 5 new words",
      "color": "#FF6B6B",
      "order": 0,
      "done": true
    },
    {
      "_id": "64f8a7b9c3d4e5f6a7b8c9d1",
      "title": "Complete a vocabulary quiz",
      "color": "#4ECDC4",
      "order": 1,
      "done": true
    }
  ]
}
```

#### **Frontend Variable Mapping:**
```javascript
// Set tasks from API response (read-only)
const apiTasks = goalsData.goals.map(goal => ({
  id: goal._id,           // goal._id → task.id
  title: goal.title,      // goal.title → task.title
  done: goal.done         // goal.done → task.done (historical value)
}));
setTasks(apiTasks);

// Set editable state (false for previous days)
setIsEditable(goalsData.editable);  // goalsData.editable → isEditable (false)

// UI disables toggles when isEditable is false
<TouchableOpacity onPress={() => toggleTask(item.id)} disabled={!isEditable}>
```

---

## 🛡️ **Edge Case Handling**

### **Race Protection - Rapid Toggle Spam**
- **Implementation**: Atomic MongoDB operations using aggregation pipeline
- **Response**: Consistent state even with concurrent requests
- **Frontend**: Handles response normally, no special handling needed

### **Past Date Validation**
- **Request**: `POST /api/goals/:id/toggle` with past date
- **Response**: 
  ```json
  {
    "error": "Only today is editable",
    "message": "Historical data is read-only. You can only modify goals for today.",
    "requestedDate": "2025-09-18",
    "today": "2025-09-19"
  }
  ```
- **Status**: 400 Bad Request
- **Frontend**: Shows alert with error message

### **Goal Deletion with DailyRecords**
- **Implementation**: Soft delete (archive) preserving historical references
- **Response**: Normal success response
- **Frontend**: No special handling, historical data remains intact

### **Timezone Boundary Scenarios**
- **Implementation**: All date calculations use user's timezone
- **Response**: Consistent dates across different timezones
- **Frontend**: Automatically sends user's timezone in headers

### **Progress Queries with Missing Records**
- **Implementation**: Returns zero counts for dates without records
- **Response**: Complete date range with zero counts for missing days
- **Frontend**: Displays complete progress chart with no gaps

---

## 📋 **Additional API Endpoints**

### **Create Goal**
```http
POST /api/goals
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
  - Content-Type: application/json
Body: {
  "title": "New Goal",
  "color": "#FF6B6B"
}
```

### **Update Goal**
```http
PUT /api/goals/:id
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
  - Content-Type: application/json
Body: {
  "title": "Updated Goal",
  "color": "#4ECDC4"
}
```

### **Delete Goal (Archive)**
```http
DELETE /api/goals/:id
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
```

### **Get All Goals (Metadata)**
```http
GET /api/goals
Headers:
  - Authorization: Bearer <token>
  - X-User-Timezone: <user_timezone>
```

---

## 🔧 **Frontend Helper Functions**

### **API Headers**
```javascript
const getAuthHeaders = () => {
  const token = 'your-auth-token-here';
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-User-Timezone': userTimezone
  };
};
```

### **Date Navigation**
```javascript
// View previous day
const viewPreviousDay = async (date) => {
  const goalsData = await fetchGoalsForDate(date);
  const apiTasks = goalsData.goals.map(goal => ({
    id: goal._id,
    title: goal.title,
    done: goal.done
  }));
  setTasks(apiTasks);
  setIsEditable(goalsData.editable);  // Will be false for past dates
  setCurrentDate(new Date(date));
};

// View today
const viewToday = async () => {
  await loadTasksAndDate();
  setCurrentDate(new Date());
};
```

---

## ✅ **Integration Status**

| Flow | Status | Notes |
|------|--------|-------|
| App opens / focus | ✅ **COMPLETE** | All variables mapped correctly |
| User taps task | ✅ **COMPLETE** | Response format aligned |
| User views previous day | ✅ **COMPLETE** | Editable flag works correctly |
| Edge case handling | ✅ **COMPLETE** | All edge cases implemented |
| Timezone support | ✅ **COMPLETE** | Full timezone integration |
| Error handling | ✅ **COMPLETE** | Proper HTTP status codes |

The Daily Goal Tracker API is fully integrated with the frontend and handles all expected request/response flows correctly.
