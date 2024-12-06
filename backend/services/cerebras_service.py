from dotenv import load_dotenv
from langgraph.graph import END, START, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from langchain_cerebras import ChatCerebras
import os

'''
TODO

'''

load_dotenv()

llm = ChatCerebras(model="llama3.1-70b", api_key=os.getenv("CEREBRAS_API_KEY"))

memory = MemorySaver()

@tool
def stock_search(query: str):
    """Fetch news related to stock for sentiment analysis"""

@tool
def historical_stock_data(symbol: str):
    """Query SQL database for historical stock data."""

tools = [stock_search, historical_stock_data]
tool_node = ToolNode(tools)

def call_model(state: MessagesState):
    messages = state['messages']
    response = llm.invoke(messages)
    return {"messages": [response]}  

def should_continue(state: MessagesState):
    messages = state['messages']
    last_message = messages[-1]
    if last_message.tool_calls: 
        return "tools"
    return END 

workflow = StateGraph(MessagesState)

workflow.add_node("agent", call_model) 
workflow.add_node("tools", tool_node)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue) 
workflow.add_edge("tools", "agent")

app = workflow.compile(checkpointer=memory)

async def get_cerebras_response(user_message: str, thread_id: int):
    input_data = {"messages": [HumanMessage(content=user_message)]}
    final_state = app.invoke(input_data, config={"configurable": {"thread_id": thread_id}})
    return final_state["messages"][-1].content
