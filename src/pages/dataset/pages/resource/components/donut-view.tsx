"use client";

import {
  convertToSystemTimeZone,
  getDataType,
  getEmailDomain,
  parseNumber,
} from "@/utils/data-validation";
import { formatDateGroup, formatTimeGroup } from "@/utils/date-time-utils";
import { useEffect, useMemo, useState } from "react";
import DataSelector from "./data-selector";
import DonutChart from "./donut-chart";
import RangeSelector from "./range-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartDataItem = Record<string, string | number | Date | boolean>;

interface DonutViewProps {
  data: ChartDataItem[];
}

export function DonutView({ data }: DonutViewProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [selectedDataType, setSelectedDataType] = useState<
    "numeric" | "date" | "time" | "email" | "other"
  >("other");
  const [isRangeEnabled, setIsRangeEnabled] = useState(false);
  const [numericRange, setNumericRange] = useState<number>(2);
  const [dateGroupBy, setDateGroupBy] = useState<"year" | "quarter" | "month" | "day">("month");
  const [timeRange, setTimeRange] = useState<number>(60);

  useEffect(() => {
    if (data.length > 0) {
      const firstAttribute = Object.keys(data[0])[0];
      setSelectedAttribute(firstAttribute);
      setSelectedDataType(getDataType(data.map((item) => item[firstAttribute])));
    }
  }, [data]);

  const attributes = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(
      (key) => typeof data[0][key] === "string" || typeof data[0][key] === "number"
    );
  }, [data]);

  const groupedData = useMemo(() => {
    if (!data.length || !selectedAttribute) return [];

    const groups = data.reduce((acc, item) => {
      let key = String(item[selectedAttribute]);
      if (selectedDataType === "numeric" && isRangeEnabled) {
        const numValue = parseNumber(key);
        const rangeStart = Math.floor(numValue / numericRange) * numericRange;
        const rangeEnd = rangeStart + numericRange - 1;
        key = `${rangeStart}-${rangeEnd}`;
      } else if (selectedDataType === "date" && isRangeEnabled) {
        const date = convertToSystemTimeZone(key);
        key = formatDateGroup(date, dateGroupBy);
      } else if (selectedDataType === "time" && isRangeEnabled) {
        key = formatTimeGroup(key, timeRange);
      } else if (selectedDataType === "email") {
        key = getEmailDomain(key);
      }
      if (!acc[key]) {
        acc[key] = { name: key, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { name: string; count: number }>);

    // Sort the grouped data
    return Object.values(groups).sort((a, b) => {
      if (selectedDataType === "numeric" || selectedDataType === "time") {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
      } else if (selectedDataType === "date") {
        if (dateGroupBy === "day") {
          return parseInt(a.name) - parseInt(b.name);
        }
        return (
          convertToSystemTimeZone(a.name).getTime() - convertToSystemTimeZone(b.name).getTime()
        );
      }
      return a.name.localeCompare(b.name);
    });
  }, [
    data,
    selectedAttribute,
    selectedDataType,
    isRangeEnabled,
    numericRange,
    dateGroupBy,
    timeRange,
  ]);

  const handleAttributeChange = (attr: string) => {
    setSelectedAttribute(attr);
    setSelectedDataType(getDataType(data.map((item) => item[attr])));
  };

  const handleRangeToggle = (checked: boolean) => {
    setIsRangeEnabled(checked);
  };

  return (
    <div className="flex flex-row gap-4">
      <DonutChart data={groupedData} />
      <Card className="max-w-sm mb-4">
        <CardHeader>
          <CardTitle>Panel de Control</CardTitle>
        </CardHeader>
        <CardContent>
          <DataSelector
            attributes={attributes}
            selectedAttribute={selectedAttribute}
            selectedDataType={selectedDataType}
            onAttributeChange={handleAttributeChange}
          />
          <RangeSelector
            isRangeEnabled={isRangeEnabled}
            selectedDataType={selectedDataType}
            numericRange={numericRange}
            dateGroupBy={dateGroupBy}
            timeRange={timeRange}
            onRangeToggle={handleRangeToggle}
            onNumericRangeChange={setNumericRange}
            onDateGroupByChange={setDateGroupBy}
            onTimeRangeChange={setTimeRange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default DonutView;
