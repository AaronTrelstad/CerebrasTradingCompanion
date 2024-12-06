import React, { useEffect, useState } from "react";
import { Grid, Container, Card } from "@mui/material";
import Navbar from "../components/Navbar";
import Chart from "../components/Chart";
import Predictions from "../components/Predictions";
import Chatbot from "../components/Chatbot";
import Technicals from "../components/Technicals";
import Input from "../components/Input";
import axios from "axios";

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

/**
 * Dashboard Component: Container for Chart, Chatbot, and Technical Analysis
 */
const Dashboard: React.FC = () => {
  const [wsData, setWsData] = useState<WsData | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [ticker, setTicker] = useState<string>("AAPL");
  const [startDate, setStartDate] = useState<string>("2022-01-01");
  const [endDate, setEndDate] = useState<string>("2024-12-01");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6789");

    socket.onmessage = (event) => {
      const wsResponse = JSON.parse(event.data);
      setWsData(wsResponse);
    };

    return () => {
      socket.close();
    };
  }, []);

  const getStock = async () => {
    try {
      const response = await axios.post("http://localhost:3000/stock", {
        ticker,
        startDate,
        endDate,
      });
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "24px", marginBottom: "24px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Card elevation={3} style={{ padding: "16px" }}>
              <Input
                ticker={ticker}
                startDate={startDate}
                endDate={endDate}
                setTicker={setTicker}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                onFetch={getStock}
              />
            </Card>
            <Card
              elevation={3}
              style={{ padding: "16px", marginTop: "16px" }}
            >
              <Chart data={data} />
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              elevation={3}
              style={{ padding: "16px", marginBottom: "16px" }}
            >
              <Predictions data={data} wsData={wsData} />
            </Card>
            <Card elevation={3} style={{ padding: "16px" }}>
              <Technicals data={data} wsData={wsData} />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={3} style={{ padding: "16px" }}>
              <Chatbot />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
