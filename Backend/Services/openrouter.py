import os
import httpx
from dotenv import load_dotenv
from fastapi import HTTPException
import traceback

load_dotenv()
api_key = os.getenv('OPENROUTER_API_KEY')
# print("Loaded API KEY:", api_key if api_key else "NOT FOUND")  # Debug: Show if key is loaded
print("Loaded API KEY:", repr(api_key) if api_key else "NOT FOUND")  # 👈 This will show hidden characters


async def ask_agent(message, language):
    prompt = (
    f"You are a trustworthy Rural Health Assistant AI. "
    f"A user has asked the following health-related question:\n\n"
    f"\"{message}\"\n\n"
    f"Your responsibilities are:\n"
    f"- Accept both structured and unstructured symptom descriptions from users (patients or clinicians).\n"
    f"- Analyze the symptoms to predict possible diseases, prioritizing accuracy and safety.\n"
    f"- For each predicted disease, suggest:\n"
    f"   • The recommended first-line medication(s) based only on trusted medical sources (e.g., WHO, FDA, official guidelines).\n"
    f"   • The correct dosage (route, frequency, and duration) where possible, using standard parameters.\n"
    f"   • Optionally, if patient-specific details are available (age, weight, allergies), adjust recommendations accordingly.\n"
    f"- Provide information on precautions, contraindications, and possible side effects of the medication.\n"
    f"- Clearly explain the reasoning or level of confidence for your prediction and recommendations.\n"
    f"- If the case appears critical or life-threatening, DO NOT provide a prescription—only warn the user to urgently consult a qualified healthcare provider.\n"
    f"- Be concise, friendly, and always respond ONLY in {language}, using simple, clear, non-technical words.\n"
    f"- Do NOT provide translations, explanations, or repeated content in English or any language other than {language}.\n"
    f"- If you are unsure, say so and encourage the user to consult a healthcare professional.\n"
    f"- Respect patient privacy and ensure safe, ethical communication at all times.\n"
)

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    print("Request headers:", headers)  # Debug: Show headers being sent
    payload = {
        "model": "meta-llama/llama-3-70b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 700
    }
    print("Request payload:", payload)  # Debug: Show payload being sent
    async with httpx.AsyncClient() as client:
        response = await client.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
        print("API status code:", response.status_code)  # Debug: Show response status
        try:
            data = response.json()
        except Exception as e:
            print("Error parsing response JSON:", e)
            print("Raw response text:", response.text)
            raise
        print("API response data:", data)  # Debug: Show full API response
        if "choices" not in data:
            print("OpenRouter API error:", data)
            raise Exception(f"OpenRouter API error: {data}")
        print("OpenRouter API call successful.")
        return data["choices"][0]["message"]["content"]