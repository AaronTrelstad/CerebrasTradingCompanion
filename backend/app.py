import os
import threading
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
from services.cerebras_service import get_cerebras_response
from services.stock_service import get_stock_data
from ws.server import start_websocket_server

load_dotenv()

app = Flask(__name__)
CORS(app)

'''
Endpoint for calling chatbot
'''
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')

    if not user_message:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        response = asyncio.run(get_cerebras_response(user_message, thread_id=1))
        return jsonify({"message": response})
    except Exception as e:
        print(f"Error during chat: {e}")
        return jsonify({"error": "An error occurred while processing the request."}), 500

'''
Endpoint for gathering stock data 
'''
@app.route('/stock', methods=['POST'])
def stock():
    try:
        req_data = request.get_json()

        if not req_data:
            return jsonify({"error": "Request body must be JSON"}), 400

        ticker = req_data.get("ticker")
        start_date = req_data.get("startDate")
        end_date = req_data.get("endDate")

        if not ticker or not start_date or not end_date:
            return jsonify({"error": "Missing required fields: ticker, startDate, endDate"}), 400

        stock_data = get_stock_data(ticker, start_date, end_date)

        return jsonify(stock_data), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve stock data: {str(e)}"}), 500

if __name__ == '__main__':
    threading.Thread(target=start_websocket_server, daemon=True).start()
    app.run(port=int(os.environ.get("PORT", 3000)), debug=True)
