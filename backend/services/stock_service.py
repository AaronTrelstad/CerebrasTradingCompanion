import requests
import os

'''
TODO
1. User enters the stock to fetch and the data range
2. Compute some more advanced technical statistics
3. Write data to DB and feed to Llama Index
'''

'''
Function to fetch stock data of AAPL
'''
def get_stock_data(ticker, startDate, endDate):
    stock_api_key = os.getenv('STOCK_API_KEY')
    response = requests.get(f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/day/{startDate}/{endDate}?adjusted=true&sort=asc&apiKey={stock_api_key}")
    stock_data = response.json()
    return stock_data

'''
response = requests.get(f"https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2024-10-01/2024-12-04?adjusted=true&sort=asc&apiKey={stock_api_key}")

stock_data = response.json()
stock_summary = f"Here is the stock data for AAPL: {json.dumps(stock_data['results'][:5], indent=2)}"
llm_prompt = f"{stock_summary}\n\nUser Query: What can you tell me about this data?\n\nAnswer the query based on the stock data."
        
llm_response = asyncio.run(get_cerebras_response(llm_prompt))
'''
