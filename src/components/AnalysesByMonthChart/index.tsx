import React, { PureComponent, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { IAnalysesByMonthChartContainer } from "../AnalysesByMonthChartContainer";

export interface AnalysesByMonthChartProps {
  data: IAnalysesByMonthChartContainer[];
}

const AnalysesByMonthChart = ({ data }: AnalysesByMonthChartProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={250}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="entrada" stroke="#8884d8" />
        <Line type="monotone" dataKey="saida" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalysesByMonthChart;
