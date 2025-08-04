const axios = require('axios');

// The exam ID from your Postman screenshot
const examId = '68909caa210390ccf3e8fcaf';

// Test data for exam result submission
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
      selectedAnswer: ['0', '2', '3'] // Selecting multiple options for even numbers
    }
  ]
};

console.log('Submitting exam result with data:', JSON.stringify(testData, null, 2));

// Submit the test data to your server
axios.post('http://localhost:3001/api/exam-results/submit', testData)
  .then(response => {
    console.log('SUCCESS! Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('ERROR submitting exam:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
  });
