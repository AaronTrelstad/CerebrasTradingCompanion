import { useState, useEffect, useRef } from 'react';

/**
 * Component to render the chatbot
 * 
 * @returns Chatbot Component
 */
const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: string; message: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!userMessage) return;

    setConversation((prev) => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (response.ok) {
        setConversation((prev) => [
          ...prev,
          { role: 'bot', message: formatBotResponse(data.message) },
        ]);
      } else {
        setConversation((prev) => [
          ...prev,
          { role: 'bot', message: 'Error: Unable to process your request.' },
        ]);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setConversation((prev) => [
        ...prev,
        { role: 'bot', message: 'Error: Something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
      setUserMessage('');
    }
  };

  const formatBotResponse = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
      .replace(/\*(.*?)\*/g, '<em>$1</em>') 
      .replace(/\n/g, '<br/>') 
      .replace(/\d+\.\s/gi, '<li>') 
      .replace(/\n\n/g, '<ul>') 
      .replace(/<\/ul><ul>/g, '') 
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h3>Trading Companion</h3>

      <div
        ref={chatContainerRef}
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              marginBottom: '15px',
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong>
            <p
              style={{
                backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#E4E6EB',
                padding: '10px',
                borderRadius: '8px',
                maxWidth: '70%',
                margin: '5px',
                display: 'inline-block',
                wordWrap: 'break-word',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={{ __html: msg.message }} // Render HTML
            />
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '10px' }}>
            <p>Bot is typing...</p>
          </div>
        )}
      </div>

      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Ask a question..."
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '16px',
        }}
      />
      <button
        onClick={handleSendMessage}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default Chatbot;
