import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

interface PredictionsProps {
  wsData: any;
}

const Chart: React.FC<PredictionsProps> = ({ wsData }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const [historicalData, setHistoricalData] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    if (wsData?.timestamp && wsData?.price) {
      const newDataPoint: [number, number] = [Number(wsData.timestamp), Number(wsData.price)];

      setHistoricalData((prevData) => [...prevData, newDataPoint]);
    }
  }, [wsData]);

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      animation: true,
      zooming: {
        type: 'x',
      },
    },
    title: {
      text: 'Stock Data',
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time',
      },
      tickPixelInterval: 150,
    },
    yAxis: {
      title: {
        text: 'Stock Prices',
      },
    },
    series: [
      {
        type: 'line',
        name: 'Stock Price',
        data: historicalData, 
      },
    ],
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
};

export default Chart;
