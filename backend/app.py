import io
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import asyncio
import threading
from cerebras.cloud.sdk import AsyncCerebras
import websockets
import json
import random
import time
from dotenv import load_dotenv
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import initialize_agent
from langchain.memory import ConversationBufferMemory
from langchain_cerebras import ChatCerebras
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

cerebras_client = AsyncCerebras(api_key=os.environ.get("CEREBRAS_API_KEY"))
llm = ChatCerebras(model="llama3.1-70b", api_key=os.environ.get("CEREBRAS_API_KEY"))
stock_api_key = os.environ.get("STOCK_API_KEY")

tools = load_tools(['ddg-search', 'wikipedia', 'arxiv', 'google-finance', 'serpapi'], llm=llm)

memory = ConversationBufferMemory() 

async def websocket_handler(websocket):
    try:
        while True:
            data = {
                "price": round(random.uniform(0, 1000), 3),
                "volume": round(random.uniform(0, 100), 3),
                "timestamp": time.time(),
            }
            await websocket.send(json.dumps(data))
            await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()

async def websocket_server():
    async with websockets.serve(websocket_handler, "0.0.0.0", 6789):
        print("WebSocket server running on ws://0.0.0.0:6789")
        await asyncio.Future()

def start_websocket_server():
    asyncio.run(websocket_server())

async def get_cerebras_response(user_message):
    agent = initialize_agent(
        tools,
        llm,
        agent="zero-shot-react-description",
        verbose=True,
        memory=memory 
    )
    result = agent.run(user_message)
    return result

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        response = asyncio.run(get_cerebras_response(user_message))
        return jsonify({"message": response})
    except Exception as e:
        print(f"Error during chat: {e}")
        return jsonify({"error": "An error occurred while processing the request."}), 500


@app.route('/stock', methods=['GET'])
def stock():
    try:
        response = requests.get(f"https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2024-10-01/2024-12-04?adjusted=true&sort=asc&apiKey={stock_api_key}")

        stock_data = response.json()
        stock_summary = f"Here is the stock data for AAPL: {json.dumps(stock_data['results'][:5], indent=2)}"
        llm_prompt = f"{stock_summary}\n\nUser Query: What can you tell me about this data\n\nAnswer the query based on the stock data."
        
        llm_response = asyncio.run(get_cerebras_response(llm_prompt))

        print(llm_response)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve stock data: {e}"}), 500

@app.route('/add-documents', methods=['POST'])
def add_documents():
    directory = requests.json.get('directory')
    if not directory or not os.path.exists(directory):
        return jsonify({"error": "Valid directory path is required"}), 400

    try:
        documents = SimpleDirectoryReader(directory).load_data()
        stock_index.insert_documents(documents)
        return jsonify({"message": "Documents added successfully."})
    except Exception as e:
        print(f"Error adding documents: {e}")
        return jsonify({"error": "An error occurred while adding documents."}), 500

if __name__ == '__main__':
    threading.Thread(target=start_websocket_server, daemon=True).start()
    app.run(port=int(os.environ.get("PORT", 3000)), debug=True)
