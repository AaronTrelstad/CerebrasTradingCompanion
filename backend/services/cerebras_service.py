from cerebras.cloud.sdk import AsyncCerebras
from dotenv import load_dotenv
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import initialize_agent
from langchain.memory import ConversationBufferMemory
from langchain_cerebras import ChatCerebras
from llama_index.core.agent import ReActAgent
from llama_index.llms.cerebras import Cerebras
from llama_index.core.tools import FunctionTool
from config import Config
import os

'''
TODO
1. Add Llama Index support to querying historical stock data in SQL database
2. Add conversational memory to the chat
3. Add more data sources for the tools
'''

load_dotenv()

##cerebras_client = AsyncCerebras(api_key=Config.CEREBRAS_API_KEY)
llm = ChatCerebras(model="llama3.1-70b", api_key=Config.CEREBRAS_API_KEY)
stock_api_key = os.environ.get("STOCK_API_KEY")

tools = load_tools(['ddg-search', 'wikipedia', 'arxiv', 'google-finance', 'serpapi'], llm=llm)

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

'''
Setting up the LangChain agent
'''
async def get_cerebras_response(user_message):
    agent = initialize_agent(
        tools,
        llm,
        agent="zero-shot-react-description",
        verbose=True,
        memory=memory,
        handle_parsing_errors=True

    )
    result = agent.run(user_message)
    return result
