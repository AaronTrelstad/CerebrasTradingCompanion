import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; 
import { WebSocketServer } from 'ws'; 
import Cerebras from '@cerebras/cerebras_cloud_sdk';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5174',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

const server = createServer(app); 
const wss = new WebSocketServer({ server }); 

wss.on('connection', function connection(ws) {
  const interval = setInterval(() => {
    const data = {
      price: (Math.random() * 1000).toFixed(3),
      volume: (Math.random() * 100).toFixed(3),
      timestamp: 1,
    };
    ws.send(JSON.stringify(data));
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
  });

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('Received:', data);
  });

  ws.send('WebSocket connection established');
});

const client = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY'],
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const stream = await client.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: 'llama3.1-8b',
      stream: true,
    });

    let response = '';
    for await (const chunk of stream) {
      const choice = chunk.choices[0];

      if (choice?.delta?.content) {
        response += choice.delta.content;
        console.log(response);
      }
    }

    res.json({ message: response });

  } catch (error) {
    console.error('Error during Cerebras API call:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.get('/stock', async (req, res) => {
  res.json({
    high: 1000,
    low: 0,
    marketCap: 10000,
    open: 20,
  })
})

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
