import React from 'react';
import { Paper, Typography } from '@mui/material';

interface PredictionsProps {
  data: any;
  wsData: any
}

/**
 * Component to display the AI generate predictions
 * 
 * @param PredictionsProps
 * @returns Predictions Component
 */
const Predictions: React.FC<PredictionsProps> = ({ data, wsData }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const signal = "Buy"
  const riskScore = "Medium"
  const confidenceInterval = 66
  const pricePrediction = 244.5

  const signalColor = (signal: string) => {
    switch (signal) {
      case 'Buy':
        return 'green';
      case 'Sell':
        return 'red';
      case 'Hold':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const riskScoreColor = (riskScore: string) => {
    switch (riskScore) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'orange';
      case 'High':
        return 'red';
      default:
        return 'gray';
    }
  };

  const confidenceColor = (confidenceInterval: number) => {
    if (confidenceInterval >= 80) return 'green';
    if (confidenceInterval >= 60) return 'orange';
    return 'red';
  };

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h6">AI Predictions</Typography>
      <Typography variant="body1" style={{ color: signalColor(signal) }}>
        <strong>Signal:</strong> {signal}
      </Typography>
      <Typography variant="body1" style={{ color: riskScoreColor(riskScore) }}>
        <strong>Risk Score:</strong> {riskScore}
      </Typography>
      <Typography variant="body1" style={{ color: signalColor(riskScore) }}>
        <strong>Price Prediction:</strong> {pricePrediction}
      </Typography>
      <Typography variant="body1" style={{ color: confidenceColor(confidenceInterval) }}>
        <strong>Confidence Interval:</strong> {confidenceInterval}%
      </Typography>
    </Paper>
  );
};

export default Predictions;
