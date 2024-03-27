import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

const Analytics = (props) => {
  const { tower } = props;
  const [towerData, setTowerData] = useState([]);

  useEffect(() => {
    fetchTowerAnalytics();
  }, [tower]);

  const fetchTowerAnalytics = () => {
    axios
      .get(`/api/data/${tower}`)
      .then((res) => {
        if (res.data?.data?.length) {
          setTowerData(res.data.data);
          console.log("data: ", res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const labels =
    towerData?.map((item) => new Date(item.createdAt).toLocaleString()) ?? [];
  const tempratureData = towerData?.map((item) => item.towerTemprature) ?? [];
  const fuelData = towerData?.map((item) => item.fuelStatus) ?? [];

  console.log(labels, tempratureData, fuelData, towerData);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Temprature",
        data: tempratureData,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Fuel",
        data: fuelData,
        fill: false,
        borderColor: "#742774",
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h1>Displaying Analytics for Tower {props.tower}</h1>
      <div className="chart-container">
        <Line data={data} />
      </div>
    </div>
  );
};

export default Analytics;
