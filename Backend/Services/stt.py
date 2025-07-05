import os
from pydub import AudioSegment
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core import exceptions

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Convert .webm to .wav
def convert_webm_to_wav(webm_path: str) -> str:
    wav_path = webm_path.replace(".webm", ".wav")
    audio = AudioSegment.from_file(webm_path, format="webm")
    audio.export(wav_path, format="wav")
    return wav_path

# Speech-to-text using Gemini
def speech_to_text(file_path: str) -> str:
    uploaded_file = None
    try:
        # Convert to .wav if needed
        if file_path.endswith(".webm"):
            file_path = convert_webm_to_wav(file_path)

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        uploaded_file = genai.upload_file(file_path)
        print(f"✅ File uploaded to Gemini: {uploaded_file.uri}")

        model = genai.GenerativeModel("models/gemini-2.5-flash") 

        prompt = (
            "Listen to the audio and respond only with the English translation "
            "of the spoken content. Do not include any explanations."
        )

        response = model.generate_content([prompt, uploaded_file])
        english_text = response.text.strip()

        print("📝 Transcription:", english_text)
        return english_text

    except exceptions.GoogleAPIError as e:
        print(f"❌ Google API Error: {e.message}")
        return ""
    except FileNotFoundError as e:
        print(f"❌ {e}")
        return ""
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return ""
    finally:
        if uploaded_file:
            try:
                genai.delete_file(uploaded_file.name)
                print(f"🗑️ Deleted uploaded file: {uploaded_file.name}")
            except Exception as cleanup_error:
                print(f"⚠️ Error deleting file: {cleanup_error}")
