import React, { useEffect, useState } from 'react';
import { Grid, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Chart from '../components/Chart';
import Predictions from '../components/Predictions';
import Chatbot from '../components/Chatbot';
import Technicals from '../components/Technicals';
import axios from 'axios'

interface WsData {
  price: number;
  volume: number;
  timestamp: string;
}

interface Data {
  high: number;
  low: number;
  marketCap: number;
  open: number;
}

const Dashboard: React.FC = () => {
  const [wsData, setWsData] = useState<WsData | null>(null);
  const [data, setData] = useState<Data | null>(null)


  const getStock = async () => {
    const response = await axios.get('http://localhost:3000/stock')

    setData(response.data.results)
  }

  useEffect(() => {
    getStock()

    const socket = new WebSocket('ws://localhost:6789');

    socket.onmessage = (event) => {
      const wsResponse = JSON.parse(event.data);
      setWsData(wsResponse); 
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Chart wsData={wsData} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Predictions data={data} wsData={wsData} />
            <Technicals data={data} wsData={wsData} />
          </Grid>
          <Grid item xs={12}>
            <Chatbot />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;

