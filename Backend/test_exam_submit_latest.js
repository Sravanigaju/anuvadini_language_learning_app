const axios = require('axios');

// Use the exam ID from your Postman response
const examId = '68909caa210390ccf368fcaf';

// Test data for exam submission
const testData = {
  userId: 'test_student_123',
  examId: examId,
  startTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
  endTime: new Date().toISOString(), // now
  answers: [
    {
      questionId: '0', // First question (index 0)
      selectedAnswer: ['1'] // Selecting option at index 1
    },
    {
      questionId: '1', // Second question (index 1)
      selectedAnswer: ['0', '2', '3'] // Selecting options at index 0, 2, and 3 (even numbers)
    }
  ]
};

console.log('Submitting exam results for exam ID:', examId);
console.log('Submission data:', JSON.stringify(testData, null, 2));

// Submit the test data to your server running on port 3001
axios.post('http://localhost:3001/api/exam-results/submit', testData)
  .then(response => {
    console.log('SUCCESS! Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('ERROR submitting exam:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // outside the 2xx range
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running on port 3001?');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
  });
