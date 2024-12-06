import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

interface ChartProps {
  data: any;
}

/**
 * Component to display the stock chart data
 * 
 * @param ChartProps
 * @returns Chart Component
 */
const Chart: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const [historicalData, setHistoricalData] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    if (chartRef && chartRef.current && data) {
      console.log(data)
      setHistoricalData(
        data.map((cell: { t: any; c: any; }) => [cell.t, cell.c])
      );
    }
  }, [data]);

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
