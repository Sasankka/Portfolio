from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://127.0.0.1:5500", "http://localhost:5500"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"],
        "expose_headers": ["Content-Type"]
    }
})

@app.route('/')
def home():
    return jsonify({"status": "success", "message": "API is running"})

@app.route('/test', methods=['GET'])
def test_endpoint():
    print("Test endpoint called!")
    return make_response(jsonify({
        "status": "success",
        "message": "API is working!"
    }))

@app.route('/send_message', methods=['POST', 'OPTIONS'])
def send_message():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    try:
        print("\n=== Incoming Request ===")
        print(f"Method: {request.method}")
        print(f"Headers: {dict(request.headers)}")
        print(f"Content-Type: {request.content_type}")
        
        raw_data = request.get_data(as_text=True)
        print(f"Raw data: {raw_data}")
        
        if not request.is_json:
            return make_response(jsonify({
                "status": "error",
                "message": "Content-Type must be application/json"
            }), 400)

        try:
            data = request.get_json()
            print(f"Parsed JSON data: {data}")
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            return make_response(jsonify({
                "status": "error",
                "message": f"Invalid JSON format: {str(e)}"
            }), 400)
        
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            missing = []
            if not name: missing.append('name')
            if not email: missing.append('email')
            if not message: missing.append('message')
            
            print(f"Missing fields: {', '.join(missing)}")
            return make_response(jsonify({
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing)}"
            }), 400)

        print(f"Message received from {name} ({email})")
        response = make_response(jsonify({
            "status": "success",
            "message": "Message received successfully!"
        }), 200)
        response.headers['Content-Type'] = 'application/json'
        return response

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return make_response(jsonify({
            "status": "error",
            "message": f"Server error: {str(e)}"
        }), 500)

@app.after_request
def after_request_func(response):
    print(f"\n=== Outgoing Response ===")
    print(f"Status: {response.status}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Data: {response.get_data(as_text=True)}")
    return response

if __name__ == '__main__':
    PORT = 5000
    print("Starting Flask server...")
    print(f"Server will be available at http://127.0.0.1:{PORT}")
    print(f"Test endpoint: http://127.0.0.1:{PORT}/test")
    print(f"Send message endpoint: http://127.0.0.1:{PORT}/send_message")
    app.run(debug=True, port=PORT, host='127.0.0.1')