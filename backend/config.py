import os

class Config:
    CEREBRAS_API_KEY = os.getenv('CEREBRAS_API_KEY')
    STOCK_API_KEY = os.getenv('STOCK_API_KEY')
    PORT = os.getenv('PORT', 3000)

