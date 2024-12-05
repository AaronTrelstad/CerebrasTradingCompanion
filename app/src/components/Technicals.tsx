import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

type FinancialData = {
  price: string;
  volume: string;
  marketCap: string;
  confidenceInterval: string;
  open: string;
  high: string;
  low: string;
};

const Information: React.FC<{ data: any, wsData: any }> = ({ data, wsData }) => {
  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Technical Data
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1">Price:</Typography>
          <Typography variant="body2">{wsData?.price}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">Volume:</Typography>
          <Typography variant="body2">{wsData?.volume}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">Market Cap:</Typography>
          <Typography variant="body2">{data?.marketCap}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">Open:</Typography>
          <Typography variant="body2">{data?.open}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">High:</Typography>
          <Typography variant="body2">{data?.high}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">Low:</Typography>
          <Typography variant="body2">{data?.low}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Information;

