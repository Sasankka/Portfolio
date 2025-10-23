from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
import json
import os
import sys
import types

# Create a dummy pwd module for Windows
if sys.platform == 'win32':
    pwd = types.ModuleType('pwd')
    pwd.getpwuid = lambda x: None
    sys.modules['pwd'] = pwd
import sys
import platform

# Add error handling for pwd module on Windows
if platform.system() == 'Windows':
    sys.modules['pwd'] = None

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://127.0.0.1:5500", "http://localhost:5500"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"],
        "expose_headers": ["Content-Type"]
    }
})

# Email configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

# Enable SMTP debug logging
app.config['MAIL_DEBUG'] = True
app.config['MAIL_SUPPRESS_SEND'] = False

# Initialize Flask-Mail
mail = Mail(app)

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

        # Debug email configuration
        print("\n=== Email Configuration ===")
        print(f"MAIL_SERVER: {app.config.get('MAIL_SERVER')}")
        print(f"MAIL_PORT: {app.config.get('MAIL_PORT')}")
        print(f"MAIL_USE_TLS: {app.config.get('MAIL_USE_TLS')}")
        print(f"MAIL_USERNAME: {app.config.get('MAIL_USERNAME')}")
        print(f"RECIPIENT_EMAIL: {os.getenv('RECIPIENT_EMAIL')}")
        
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

        try:
            print("\n=== Attempting to send email ===")
            print(f"SMTP Configuration:")
            print(f"Server: {app.config['MAIL_SERVER']}")
            print(f"Port: {app.config['MAIL_PORT']}")
            print(f"TLS: {app.config['MAIL_USE_TLS']}")
            print(f"Username: {app.config['MAIL_USERNAME']}")
            print(f"Recipient: {os.getenv('RECIPIENT_EMAIL')}")

            # Create email message
            recipient_email = os.getenv('RECIPIENT_EMAIL')
            if not recipient_email:
                raise ValueError("RECIPIENT_EMAIL not configured in .env file")

            msg = Message(
                subject=f'Portfolio Contact: Message from {name}',
                sender=app.config['MAIL_USERNAME'],
                recipients=[recipient_email],
                body=f'''New message from your portfolio contact form:

From: {name}
Email: {email}

Message:
{message}
'''
            )
            
            print("\nSending email...")
            print("\nAttempting to send email...")
            print("\nEmail Configuration Details:")
            print(f"SMTP Server: {app.config['MAIL_SERVER']}")
            print(f"SMTP Port: {app.config['MAIL_PORT']}")
            print(f"TLS Enabled: {app.config['MAIL_USE_TLS']}")
            print(f"Username: {app.config['MAIL_USERNAME']}")
            print(f"Password length: {len(app.config['MAIL_PASSWORD']) if app.config['MAIL_PASSWORD'] else 0} characters")
            
            print("\nMessage Details:")
            print(f"From: {msg.sender}")
            print(f"To: {msg.recipients}")
            print(f"Subject: {msg.subject}")
            print(f"Body: {msg.body}")
            
            try:
                with mail.connect() as smtp:
                    print("\nSMTP Connection established")
                    print(f"SMTP connection details: {smtp}")
                    smtp.send(msg)
                print(f"Email sent successfully to {os.getenv('RECIPIENT_EMAIL')}")
            except Exception as mail_error:
                print(f"\nError sending email via SMTP:")
                print(f"Error type: {type(mail_error).__name__}")
                print(f"Error message: {str(mail_error)}")
                print(f"Error args: {mail_error.args if hasattr(mail_error, 'args') else 'No args'}")
                print(f"Full error details: {mail_error.__dict__}")
                raise mail_error
            
        except Exception as e:
            print(f"\nError in send_message endpoint:")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            print(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")
            return make_response(jsonify({
                "status": "error",
                "message": f"Failed to send email: {str(e)}"
            }), 500)

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
    try:
        print("Starting Flask server...")
        print(f"Email configuration:")
        print(f"- SMTP Server: {app.config['MAIL_SERVER']}")
        print(f"- SMTP Port: {app.config['MAIL_PORT']}")
        print(f"- TLS Enabled: {app.config['MAIL_USE_TLS']}")
        print(f"- Username: {app.config['MAIL_USERNAME']}")
        print(f"- Password Set: {'Yes' if app.config['MAIL_PASSWORD'] else 'No'}")
        print(f"- Recipient: {os.getenv('RECIPIENT_EMAIL')}")
        
        # Test SMTP connection before starting server
        with mail.connect() as smtp:
            print("\nSMTP connection test successful!")
            print(f"Connected to SMTP server!")
        
        app.run(debug=True, host='127.0.0.1', port=5000)
    except Exception as e:
        print(f"\nError starting server:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")
        raise