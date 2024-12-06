import asyncio
import random
import websockets
import json
import time

'''
TODO
1. Find a affordable way to stream stock data
'''

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
