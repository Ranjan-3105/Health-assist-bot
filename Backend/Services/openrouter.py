import os
import httpx
from dotenv import load_dotenv

load_dotenv()

async def ask_agent(message, language):
    prompt = f"""
    You are a rural health assistant AI. A user says: '{message}'.
    Explain the problem clearly, offer home care tips, and suggest when to see a doctor.
    Respond in {language} using simple words.
    """
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openrouter/gpt-4",
        "messages": [{"role": "user", "content": prompt}]
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
        return response.json()["choices"][0]["message"]["content"]