"use client";

import {
  Bar,
  BarChart as BarChartComponent,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { Row } from "@/models/ckan";

interface BarChartProps {
  data: Row[];
  xAxis: string;
  dataKeys: string[];
  totalBar?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  label?: string;
}
const CustomTooltip = ({ active = false, payload, label = "" }: CustomTooltipProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scrollAmount = 0;
    const delay = 1500;
    const startScroll = () => {
      const scrollInterval = setInterval(() => {
        container.scrollBy(0, 1);
        scrollAmount += 1;
        if (scrollAmount >= container.scrollHeight - container.clientHeight)
          clearInterval(scrollInterval);
      }, 20);
    };
    const delayTimeout = setTimeout(startScroll, delay);
    return () => clearTimeout(delayTimeout);
  }, [active, label]);

  if (active && payload && payload.length) {
    return (
      <Card className="w-full max-w-xs bg-custom-secondary-3 p-2 rounded-lg min-w-40 shadow-md max-h-96 overflow-y-auto">
        <CardHeader className="pt-0 pb-2">
          <CardTitle className="text-white font-poppins font-semibold text-center">
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent
          ref={containerRef}
          className="px-2 py-0 max-h-40 overflow-hidden overflow-y-auto"
        >
          <ul className="grid grid-cols-1">
            {payload
              .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
              .map(({ name, value, color }: { name: string; value: string; color: string }) => (
                <li key={name} className="flex flex-row items-center justify-start gap-2">
                  {/* un cuadro de color para cada elemento */}
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <p className="font-poppins font-semibold" style={{ color }}>{`${
                    name.split("-")[1] ?? name
                  }: ${value}`}</p>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
  return null;
};
export const BarChart: React.FC<BarChartProps> = ({ data, xAxis, dataKeys, totalBar = true }) => {
  type DataGroup = { name: string; _count: number } & Record<string, number>;
  const dataGrouped: Array<DataGroup> = [];
  const bars = new Map<string, string>();
  // TODO: bug en el bars, cuando dos columnas tiene el mismo nombre el color tiene que ser el mismo
  data.forEach((item) => {
    const key = item[xAxis]?.toString() ?? "null";
    const index = dataGrouped.findIndex((group) => group.name === key);
    if (index === -1)
      dataGrouped.push({
        name: key,
        _count: 1,
        ...dataKeys.reduce((acc, key) => {
          bars.set(`${key}-${item[key]}`, key);
          return { ...acc, [`${key}-${item[key]}`]: 1 };
        }, {}),
      } as DataGroup);
    else {
      dataGrouped[index]._count = (dataGrouped[index]._count || 0) + 1;
      dataKeys.forEach((key) => {
        bars.set(`${key}-${item[key]}`, key);
        dataGrouped[index][`${key}-${item[key]}`] =
          (dataGrouped[index][`${key}-${item[key]}`] || 0) + 1; // TODO: revisar esto
      });
    }
  });
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Gráfico Dinámico</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChartComponent
            data={dataGrouped.sort((a, b) => {
              if (typeof a.name === "number" && typeof b.name === "number") return a.name - b.name;
              return a.name.localeCompare(b.name);
            })}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={"name"} />
            <YAxis />
            {/* <Tooltip /> */}
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#000" />
            {/* <Legend /> */}
            {totalBar && (
              <Bar
                dataKey={"_count"}
                name={"Total"}
                fill={`hsl(${-1 * 60}, 70%, 50%)`}
                stackId="stack"
              />
            )}
            {Array.from(bars)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([key, id], index) => (
                <Bar key={key} dataKey={key} fill={`hsl(${index * 60}, 70%, 50%)`} stackId={id} />
              ))}
          </BarChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
