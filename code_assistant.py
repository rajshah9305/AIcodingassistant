#!/usr/bin/env python
"""AI Code Assistant powered by Groq"""

import os
import sys
from typing import List, Dict
from groq import Groq
from dotenv import load_dotenv
from rich.console import Console
from rich.markdown import Markdown
from rich.prompt import Prompt

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    print("❌ Error: GROQ_API_KEY not found in .env")
    sys.exit(1)

client = Groq(api_key=api_key)
console = Console()

SYSTEM_PROMPT = """You are CodeBuddy, an AI coding assistant that helps write, explain, debug, and refactor code.
1. Ask clarifying questions if ambiguous.
2. Provide only code unless explanation requested.
3. Use Markdown with headings for explanations.
4. Wrap code in triple backticks with language.
5. Keep responses concise but correct."""

chat_history: List[Dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]

def ask_groq(user_input: str) -> str:
    chat_history.append({"role": "user", "content": user_input})
    
    stream = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=chat_history,
        temperature=0.7,
        max_tokens=4096,
        stream=True,
    )
    
    assistant_reply = ""
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            assistant_reply += delta
            console.print(delta, end="", style="bold cyan")
    console.print()
    
    chat_history.append({"role": "assistant", "content": assistant_reply})
    return assistant_reply

def main():
    console.print("[bold magenta]🤖 CodeBuddy – Groq-powered coding assistant[/bold magenta]")
    console.print("Type your request, or 'exit' to quit.\n")
    
    while True:
        try:
            user_msg = Prompt.ask("[green]You[/green]")
            if user_msg.strip().lower() in {"exit", "quit"}:
                console.print("\n👋 Bye!")
                break
            
            console.print("\n[bold cyan]CodeBuddy:[/bold cyan] ", end="")
            response = ask_groq(user_msg)
            
            if "```" in response:
                console.print("\n[bold yellow]Result:[/bold yellow]")
                console.print(Markdown(response))
            
            console.print("-" * 60)
        
        except KeyboardInterrupt:
            console.print("\n\n👋 Bye!")
            break
        except Exception as e:
            console.print(f"[red]Error:[/red] {e}", style="bold red")
            break

if __name__ == "__main__":
    main()
