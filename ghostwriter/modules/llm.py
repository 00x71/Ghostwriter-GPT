import os
from typing import Optional

import openai


def generate_finding(prompt: str, model: Optional[str] = None) -> str:
    """Generate text for a finding using an LLM via the OpenAI API."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set")

    model = model or os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content.strip()
