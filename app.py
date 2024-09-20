from flask import Flask, request, jsonify, render_template
import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Set your OpenAI API key securely
openai.api_key = os.getenv('OPENAI_API_KEY')  # Ensure you have set this environment variable

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/assist', methods=['POST'])
def assist():
    data = request.json
    text = data.get('text', '')
    messages = [
        {"role": "system", "content": "You are a helpful assistant proficient in correcting Spanish text."},
        {"role": "user", "content": f"Correct the following Spanish text and explain any mistakes:\n\n{text}"}
    ]
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )
    return jsonify({'result': response.choices[0].message['content'].strip()})

@app.route('/api/translate_to_spanish', methods=['POST'])
def translate_to_spanish():
    data = request.json
    text = data.get('text', '')
    messages = [
        {"role": "system", "content": "You are a helpful assistant proficient in translating English to Spanish."},
        {"role": "user", "content": f"Translate the following English text to Spanish, considering cultural context:\n\n{text}"}
    ]
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )
    return jsonify({'result': response.choices[0].message['content'].strip()})

@app.route('/api/translate_to_english', methods=['POST'])
def translate_to_english():
    data = request.json
    text = data.get('text', '')
    messages = [
        {"role": "system", "content": "You are a helpful assistant proficient in translating Spanish to English."},
        {"role": "user", "content": f"Translate the following Spanish text to English, considering cultural context:\n\n{text}"}
    ]
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )
    return jsonify({'result': response.choices[0].message['content'].strip()})

@app.route('/api/conjugate', methods=['POST'])
def conjugate():
    data = request.json
    verb = data.get('verb', '')
    messages = [
        {"role": "system", "content": "You are a helpful assistant proficient in Spanish verb conjugations."},
        {"role": "user", "content": f"Provide the conjugations of the Spanish verb '{verb}' in the following tenses: present, subjunctive, preterite, imperfect, and future. Do not include 'vosotros' forms. Return the data in JSON format with keys for each tense ('present', 'subjunctive', etc.), and for each tense, provide a dictionary with keys 'yo', 'tú', 'él/ella/usted', 'nosotros', 'ellos/ellas/ustedes', and their corresponding conjugations."}
    ]
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        max_tokens=700,
        temperature=0.7,
    )
    # Parse the assistant's response as JSON
    try:
        content = response.choices[0].message['content'].strip()
        # Remove any code blocks if present
        if content.startswith("```") and content.endswith("```"):
            content = content[content.find('\n')+1:content.rfind('\n')]
        conjugations = json.loads(content)
        return jsonify({'result': conjugations})
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to parse conjugations', 'raw_response': content})

@app.route('/api/define', methods=['POST'])
def define():
    data = request.json
    word = data.get('word', '')
    messages = [
        {"role": "system", "content": "You are a helpful assistant proficient in defining Spanish words in English."},
        {"role": "user", "content": f"Define the Spanish word '{word}' in English."}
    ]
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        max_tokens=60,
        temperature=0.7,
    )
    return jsonify({'result': response.choices[0].message['content'].strip()})

@app.route('/api/question', methods=['POST'])
def question():
    data = request.json
    query = data.get('query', '')
    messages = [
        {"role": "system", "content": "You are a helpful assistant for language learning."},
        {"role": "user", "content": query}
    ]
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )
    return jsonify({'result': response.choices[0].message['content'].strip()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
