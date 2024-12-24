import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

interface DonutChartProps {
  data: { name: string; count: number }[];
}

function generateUniqueColors(count: number): string[] {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => `hsl(${i * hueStep}, 70%, 50%)`);
}

export default function DonutChart({ data }: DonutChartProps) {
  const colors = useMemo(() => generateUniqueColors(data.length), [data]);

  const chartConfig = useMemo(() => {
    return data.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: colors[index],
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [data, colors]);

  return (
    <Card className="w-full max-w-4xl">
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={"60%"}
                outerRadius={"70%"}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
                nameKey="name"
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p className="font-bold">{data.name}</p>
                        <p>Cantidad: {data.count}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
