from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "AI Smart Women Safety API is running"
    })


@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({
        "online": True,
        "service": "Women Safety System"
    })


@app.route("/api/emergency", methods=["POST"])
def emergency():
    data = request.get_json()

    latitude = data.get("latitude")
    longitude = data.get("longitude")

    print("🚨 EMERGENCY ALERT")
    print("Latitude:", latitude)
    print("Longitude:", longitude)

    return jsonify({
        "success": True,
        "message": "Emergency alert received",
        "location": {
            "latitude": latitude,
            "longitude": longitude
        }
    })


@app.route("/api/voice-trigger", methods=["POST"])
def voice_trigger():
    data = request.get_json()

    voice_text = data.get("text", "")

    print("🎤 Voice detected:", voice_text)

    return jsonify({
        "success": True,
        "triggered": True,
        "message": "Voice trigger detected",
        "text": voice_text
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )