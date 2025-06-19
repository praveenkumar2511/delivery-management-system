import Chart from "react-apexcharts";

const ApexChart = ({ dailyUpdates }:any) => {
  // Extract categories (labels) and data (counts)
  const categories = dailyUpdates?.message?.data.map((item:any) => item.label) || [];
  const data = dailyUpdates?.message?.data.map((item:any) => item.count) || [];

  const chartData = {
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories, // Display all labels
      },
      yaxis: {
        min: 0, // Ensures bars appear even if count is 0
        max: Math.max(...data, 1), // Prevents all bars from being invisible
      },
      grid: {
        show: true, // Enables gridlines to help visibility
      },
      dataLabels: {
        enabled: false, // Show values on bars
        formatter: ( { dataPointIndex }:any) => categories[dataPointIndex], // Show label instead of number
        style: {
          colors: ["#000"], // Text color
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top", // Labels above the bars
          },
        },
      },
    },
    series: [
      {
        name: "Transactions",
        data: data.map((count:any) => (count === 0 ? 0.5 : count)), // Small value to show 0-count bars
      },
    ],
  };



  return (
    <div className="w-full ">
      {/* <h3>Daily Transactions</h3> */}
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width={800}
        height={420}
      />
    </div>
  );
};

export default ApexChart;


// import React, { useState, useEffect } from "react";
// import Chart from "react-apexcharts";

// type DailyUpdate = {
//   label: string;
//   count: number;
// };

// type Props = {
//   dailyUpdates: DailyUpdate[];
// };

// const DailyUpdatesChart: React.FC<Props> = ({ dailyUpdates }) => {
//   const [chartOptions, setChartOptions] = useState({
//     chart: {
//       id: "daily-updates-bar",
//       toolbar: { show: false },
//     },
//     xaxis: {
//       categories: [], // Will be updated dynamically
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "50%",
//       },
//     },
//     yaxis: {
//       tickAmount: 5,
//       min: 0,
//     },
//   });

//   const [chartSeries, setChartSeries] = useState<any>([]);

//   useEffect(() => {
//     if (dailyUpdates.length > 0) {
//       const labels = dailyUpdates.map((item) => item.label);
//       const counts = dailyUpdates.map((item) => item.count);

//       setChartOptions((prevOptions: any) => ({
//         ...prevOptions,
//         xaxis: { categories: labels },
//       }));

//       setChartSeries([{ name: "Count", data: counts }]);
//     }
//   }, [dailyUpdates]); // Dependency array ensures update on prop change

//   return (
//     <div className="chart-container">
//       <Chart options={chartOptions} series={chartSeries} type="bar" width="500" height="320" />
//     </div>
//   );
// };

// export default DailyUpdatesChart;

