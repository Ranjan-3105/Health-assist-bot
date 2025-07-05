import os
import httpx
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('OPENROUTER_API_KEY')
# print("Loaded API KEY:", api_key if api_key else "NOT FOUND")  # Debug: Show if key is loaded
print("Loaded API KEY:", repr(api_key) if api_key else "NOT FOUND")  # 👈 This will show hidden characters


async def ask_agent(message, language):
    prompt = (
        f"You are a helpful, trustworthy rural health assistant AI. "
        f"A user has asked the following health-related question:\n\n"
        f"\"{message}\"\n\n"
        f"Your job is to:\n"
        f"- Clearly explain the possible causes and symptoms in simple, non-technical language.\n"
        f"- Suggest safe home remedies or first steps the user can take.\n"
        f"- Warn about any serious signs that mean the user should see a doctor or visit a hospital.\n"
        f"- Be concise, friendly, and use {language} for your response.\n"
        f"- Avoid giving any medication names ( only give safe and common one ) or dosages.\n"
        f"- If you do not know the answer, say so and encourage the user to consult a healthcare professional.\n"
        f"Respond in {language} using simple words."
    )
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    print("Request headers:", headers)  # Debug: Show headers being sent
    payload = {
        "model": "anthropic/claude-3-haiku",
        "messages": [{"role": "user", "content": prompt}]
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