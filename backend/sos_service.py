from datetime import datetime

from backend.config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    EMERGENCY_PHONE
)


def send_sos(latitude=None, longitude=None):

    if latitude is not None and longitude is not None:
        location = f"https://www.google.com/maps?q={latitude},{longitude}"

        message = (
            "Vazhi Thunai Emergency Alert!\n"
            "The user may be in an emergency.\n"
            f"Location: {location}"
        )
    else:
        message = (
            "Vazhi Thunai Emergency Alert!\n"
            "The user may be in an emergency."
        )

    # Demo mode
    if not all([
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_PHONE_NUMBER,
        EMERGENCY_PHONE
    ]):

        print("\n===== DEMO SOS =====")
        print(message)
        print("====================\n")

        return {
            "success": True,
            "mode": "demo",
            "message": "SOS triggered successfully",
            "time": datetime.now().isoformat()
        }

    try:
        from twilio.rest import Client

        client = Client(
            TWILIO_ACCOUNT_SID,
            TWILIO_AUTH_TOKEN
        )

        sms = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=EMERGENCY_PHONE
        )

        call = client.calls.create(
            twiml=(
                "<Response>"
                "<Say>"
                "Emergency alert from Vazhi Thunai. "
                "Please check the emergency message."
                "</Say>"
                "</Response>"
            ),
            from_=TWILIO_PHONE_NUMBER,
            to=EMERGENCY_PHONE
        )

        return {
            "success": True,
            "mode": "twilio",
            "sms_sid": sms.sid,
            "call_sid": call.sid
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }