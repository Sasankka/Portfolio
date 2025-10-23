from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/test', methods=['GET'])
def test_endpoint():
    print("Test endpoint byl volán!")
    return make_response(jsonify({
        "status": "success", 
        "message": "API is working!"
    }))

@app.after_request
def after_request(response):
    print(f"[{request.method}] {request.path}")
    print(f"Request Headers: {dict(request.headers)}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Status: {response.status}")
    print(f"Response Data: {response.get_data(as_text=True)}")
    return response

@app.route('/send_message', methods=['POST'])
def test():
    print("Test endpoint byl volán!")
    return jsonify({"status": "success", "message": "API is working!"})

@app.after_request
def after_request(response):
    print(f"[{request.method}] {request.path} -> {response.status}")
    return response

@app.route('/send_message', methods=['POST'])
def test():
    return jsonify({"status": "success", "message": "API is working!"})

# Email configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)

@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        print("\n=== Incoming Request ===")
        print(f"Content-Type: {request.content_type}")
        raw_data = request.get_data(as_text=True)
        print(f"Raw data: {raw_data}")
        
        if not request.is_json:
            error_response = make_response(jsonify({
                "status": "error",
                "message": "Missing JSON in request"
            }), 400)
            error_response.headers['Content-Type'] = 'application/json'
            return error_response

        try:
            data = request.get_json()
            print(f"Parsed JSON data: {data}")
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            error_response = make_response(jsonify({
                "status": "error",
                "message": f"Invalid JSON format: {str(e)}"
            }), 400)
            error_response.headers['Content-Type'] = 'application/json'
            return error_response
        
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            print(f"Missing fields: name={name}, email={email}, message={message}")
            error_response = make_response(jsonify({
                "status": "error",
                "message": "Missing required fields: name, email, or message"
            }), 400)
            error_response.headers['Content-Type'] = 'application/json'
            return error_response

        print(f"Message received from {name} ({email})")
        success_response = make_response(jsonify({
            "status": "success",
            "message": "Message received successfully!"
        }), 200)
        success_response.headers['Content-Type'] = 'application/json'
        return success_response

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        error_response = make_response(jsonify({
            "status": "error",
            "message": f"Server error: {str(e)}"
        }), 500)
        error_response.headers['Content-Type'] = 'application/json'
        return error_response

if __name__ == '__main__':
    app.run(debug=True, port=5500)