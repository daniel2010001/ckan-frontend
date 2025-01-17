import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function generateUniqueColors(count: number): string[] {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => `hsl(${i * hueStep}, 70%, 50%)`);
}

interface PieChartViewProps {
  data: { name: string; value: number }[];
}
export const PieChartView: React.FC<PieChartViewProps> = ({ data }) => {
  const colors = useMemo(() => generateUniqueColors(data.length), [data]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico circular</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
