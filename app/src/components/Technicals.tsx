import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

interface InformationProps {
  data: any;
  wsData: any;
}

const Information: React.FC<InformationProps> = ({ data, wsData }) => {
  // Handle the possibility of empty or incorrect data format gracefully
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Technical Data
      </Typography>
      <Grid container spacing={2}>
        {/* Real-time WebSocket data */}
        {wsData && (
          <>
            <Grid item xs={6}>
              <Typography variant="body1">Price:</Typography>
              <Typography variant="body2">{wsData.price || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Volume:</Typography>
              <Typography variant="body2">{wsData.volume || 'N/A'}</Typography>
            </Grid>
          </>
        )}

        {/* Data from the API */}
        {hasData && (
          <>
            <Grid item xs={6}>
              <Typography variant="body1">Market Cap:</Typography>
              <Typography variant="body2">{data[0]?.marketCap || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Open:</Typography>
              <Typography variant="body2">{data[0]?.o || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">High:</Typography>
              <Typography variant="body2">{data[0]?.h || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Low:</Typography>
              <Typography variant="body2">{data[0]?.l || 'N/A'}</Typography>
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

export default Information;
