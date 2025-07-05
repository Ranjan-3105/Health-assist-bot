import os
import uuid
from dotenv import load_dotenv
from sarvamai import SarvamAI
from sarvamai.play import save

load_dotenv()

client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))

def text_to_speech(text: str, lang: str = "or-IN") -> str:
    filename = f"tts_{uuid.uuid4().hex}.wav"
    output_dir = "tts_output"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, filename)
    try:
        tts = client.text_to_speech.convert(
            text=text,
            target_language_code=lang,
            speaker="hitesh",
            enable_preprocessing=True,
        )
        save(tts, output_path)
        return output_path
    except Exception as e:
        print(f"SarvamAI TTS error: {e}")
        raise

# speech_to_text("D:/projects/Health-assist-bot/Backend/Services/mps_TEST/t5.mp3")

