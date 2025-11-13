const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/content/levels',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Raw Response:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed Response:', JSON.stringify(parsed, null, 2));
    } catch (err) {
      console.log('Failed to parse JSON:', err.message);
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.end();
