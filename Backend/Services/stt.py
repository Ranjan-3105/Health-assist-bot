import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core import exceptions

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def speech_to_text(file_path: str) -> str:
    try:
        uploaded_file = genai.upload_file(file_path)
        print(f"File uploaded: {uploaded_file.uri}")

        model = genai.GenerativeModel("models/gemini-2.5-flash")

        prompt = (
            "Listen to the audio and respond only with the English translation "
            "of the spoken content. Do not include any explanations."
        )

        response = model.generate_content([prompt, uploaded_file])
        english_text = response.text.strip()

        print("English Translation:")
        print(english_text)
        return english_text

    except exceptions.GoogleAPIError as e:
        print(f"Google API Error: {e.message}")
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        return ""

    finally:
        try:
            if 'uploaded_file' in locals():
                genai.delete_file(uploaded_file.name)
                print(f"Deleted uploaded file from Gemini: {uploaded_file.name}")
        except Exception as cleanup_error:
            print(f"Error deleting uploaded file: {cleanup_error}")

speech_to_text("D:/projects/Health-assist-bot/Backend/Services/mps_TEST/t5.mp3")