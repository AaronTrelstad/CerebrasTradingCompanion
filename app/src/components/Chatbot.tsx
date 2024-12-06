import { Box, Button, CardActions, CircularProgress, TextField, Typography } from '@mui/material';
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
    <Box
      sx={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Chatbot Assistant
      </Typography>

      <Box
        ref={chatContainerRef}
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "divider",
          padding: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {conversation.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: 2,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: msg.role === "user" ? "primary.light" : "grey.200",
                padding: 1,
                borderRadius: 2,
                maxWidth: "70%",
                marginX: msg.role === "user" ? "auto" : 0,
                display: "inline-block",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
              dangerouslySetInnerHTML={{ __html: msg.message }}
            />
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ textAlign: "center", fontStyle: "italic", marginTop: 1 }}>
            <Typography variant="body2">Bot is typing...</Typography>
          </Box>
        )}
      </Box>

      <TextField
        fullWidth
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Ask a question..."
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          onClick={handleSendMessage}
          disabled={isLoading}
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 2 }}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </CardActions>
    </Box>
  );
};

export default Chatbot;
