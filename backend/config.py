from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Vosk
MODEL_PATH = BASE_DIR / "models" / "vosk-model-small-en-us-0.15"

# Microphone
MIC_DEVICE = 3
MIC_SAMPLE_RATE = 48000
MIC_CHANNELS = 4
VOSK_SAMPLE_RATE = 16000

# Twilio
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "")

# Emergency contact
EMERGENCY_PHONE = os.getenv("EMERGENCY_PHONE", "")