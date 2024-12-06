import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';

interface TechnicalsProps {
  data: any;
  wsData: any;
}

/**
 * Component to display technical analysis
 * 
 * @param TechnicalsProps
 * @returns Technicals Component
 */
const Technicals: React.FC<TechnicalsProps> = ({ data, wsData }) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const [high, setHigh] = useState<number>(0);
  const [low, setLow] = useState<number>(0);

  useEffect(() => {
    if (hasData) {
      const highs = data.map((item) => item.h || 0);
      const lows = data.map((item) => item.l || 0);

      setHigh(Math.max(...highs));
      setLow(Math.min(...lows));
    }
  }, [data, hasData]);

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Technical Data
      </Typography>
      <Grid container spacing={2}>
        {wsData && (
          <>
            <Grid item xs={6}>
              <Typography variant="body1">Price:</Typography>
              <Typography variant="body2">${243.47}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Volume:</Typography>
              <Typography variant="body2">{'18.06M'}</Typography>
            </Grid>
          </>
        )}
        {hasData && (
          <>
            <Grid item xs={6}>
              <Typography variant="body1">Market Cap:</Typography>
              <Typography variant="body2">${'3.68T'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Open:</Typography>
              <Typography variant="body2">${data[0]?.o || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">High:</Typography>
              <Typography variant="body2">${high}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Low:</Typography>
              <Typography variant="body2">${low}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined">Expand</Button>
            </Grid>
          </>
        )}
        {!hasData && !wsData && (
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              No data available.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default Technicals;
