from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/send_message', methods=['POST'])
def send_message():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({"msg": "Missing name, email, or message"}), 400

    # ----- ZDE BUDE KÓD PRO ODESLÁNÍ E-MAILU (příště) -----
    print(f"Přijata zpráva od: {name} ({email})")
    print(f"Zpráva: {message}")
    # Zatím to jen vypíšeme do terminálu

    return jsonify({"msg": "Message received successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True)