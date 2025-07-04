import os
import httpx
from dotenv import load_dotenv

load_dotenv()

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
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "anthropic/claude-3-haiku",
        "messages": [{"role": "user", "content": prompt}]
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
        data = response.json()
        if "choices" not in data:
            print("OpenRouter API error:", data)
            raise Exception(f"OpenRouter API error: {data}")
        print("OpenRouter API call successful.")
        return data["choices"][0]["message"]["content"]