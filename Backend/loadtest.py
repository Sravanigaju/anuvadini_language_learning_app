import requests
import concurrent.futures
import json
import random

# Endpoint
url = "https://lrn.aicte-india.org/api/auth/register"

# Headers
headers = {
    "Content-Type": "application/json"
}

# Function to generate unique user data
def generate_user_data(i):
    username = f"testuser_{i}"
    phone_number = f"9{random.randint(100000000, 999999999)}"
    return {
        "username": username,
        "phoneNumber": phone_number,
        "password": "Test@1234"
    }

# Function to send a single POST request
def send_request(i):
    payload = generate_user_data(i)
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=5)
        return f"Request {i} - {payload['phoneNumber']} - Status: {response.status_code}"
    except Exception as e:
        return f"Request {i} - Failed: {str(e)}"

# Number of requests
total_requests = 1000

# Thread pool for concurrency
with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
    futures = [executor.submit(send_request, i) for i in range(1, total_requests + 1)]
    for future in concurrent.futures.as_completed(futures):
        print(future.result())lo    