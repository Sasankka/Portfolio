import requests
import json

def test_send_message():
    url = 'http://127.0.0.1:5000/send_message'
    data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'This is a test message'
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure Flask is running.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    test_send_message()