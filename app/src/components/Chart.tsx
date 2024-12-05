import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

interface PredictionsProps {
  wsData: any;
}

const Chart: React.FC<PredictionsProps> = ({ wsData }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  console.log(wsData)

  const [max, setMax] = useState<number>(0);
  const [min, setMin] = useState<number>(Infinity);

  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      const chart = chartRef.current.chart;

      const formattedData = [Number(wsData?.timestamp), Number(wsData?.price)];

      chart.series[0].setData(formattedData, true);
    }
  }, [wsData]);

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      animation: true,
      zooming: {
        type: "x",
      },
    },
    title: {
      text: "Stock Data",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Time",
      },
      tickPixelInterval: 150,
    },
    yAxis: {
      title: {
        text: "Stock Prices",
      },
    },
    series: [
      {
        type: "line",
        name: "Stock Price",
        data: [Number(wsData?.timestamp), Number(wsData?.price)],
      },
      
    ],
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default Chart;
