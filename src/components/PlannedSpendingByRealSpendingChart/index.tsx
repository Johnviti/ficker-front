import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PlannedByMonth } from "../PlannedSpendingByRealSppendingChartContainer";

interface PlannedSpendingByRealSpendingChartProps {
  data: PlannedByMonth[];
}

const PlannedSpendingByRealSpendingChart = ({ data }: PlannedSpendingByRealSpendingChartProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={250}>
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 80,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey="name"
          label={{ value: "Mês", position: "insideBottomRight", offset: 0 }}
          scale="band"
        />
        <YAxis label={{ value: "Valor", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="planejado" barSize={20} fill="#6C5DD3" />
        <Line type="monotone" dataKey="real" stroke="#87E344" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PlannedSpendingByRealSpendingChart;
