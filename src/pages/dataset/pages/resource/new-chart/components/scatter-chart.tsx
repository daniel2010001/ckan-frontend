import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScatterChartViewProps {
  data: { name: string; value: number }[];
}
export const ScatterChartView: React.FC<ScatterChartViewProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Gráfico de dispersión</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="value" name="value" unit="" />
          <YAxis type="number" dataKey="index" name="index" unit="" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name="Values"
            data={data.map((item, index) => ({ ...item, index }))}
            fill="#8884d8"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
