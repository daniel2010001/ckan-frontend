"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDataType, getEmailDomain, parseNumber } from "@/utils/data-validation";
import { formatDateGroup, formatTimeGroup } from "@/utils/date-time-utils";
import { useEffect, useMemo, useState } from "react";
import BarChart from "./bar-chart";
import ControlPanel from "./control-panel";
import RangeSelector from "./range-selector";

type ChartDataItem = Record<string, string | number | Date>;

interface BarViewProps {
  data: ChartDataItem[];
}

export function BarView({ data }: BarViewProps) {
  const [totalBar, setTotalBar] = useState(true);
  const [selectedDataKeys, setSelectedDataKeys] = useState<Array<string>>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<string>(
    Object.keys(data[0])?.[0] ?? ""
  );
  const [selectedDataType, setSelectedDataType] = useState<
    "numeric" | "date" | "time" | "email" | "other"
  >("other");
  const [isRangeEnabled, setIsRangeEnabled] = useState(false);
  const [numericRange, setNumericRange] = useState<number>(2);
  const [dateGroupBy, setDateGroupBy] = useState<"year" | "quarter" | "month" | "day">("month");
  const [timeRange, setTimeRange] = useState<number>(60);
  console.log(selectedAttribute);
  useEffect(() => {
    if (data.length > 0) {
      const firstAttribute = Object.keys(data[0])[0];
      console.log(firstAttribute);
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
        const date = new Date(key);
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
        return new Date(a.name).getTime() - new Date(b.name).getTime();
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
  const handleDataKeyChange = (key: string, isChecked: boolean) => {
    if (isChecked) setSelectedDataKeys([...selectedDataKeys, key]);
    else setSelectedDataKeys(selectedDataKeys.filter((k) => k !== key));
  };
  const handleTotalBarChange = () => setTotalBar((prev) => !prev);

  return (
    <div className="flex flex-row gap-4">
      <BarChart
        data={groupedData}
        xAxis={selectedAttribute}
        dataKeys={attributes}
        totalBar={totalBar}
      />
      <Card className="max-w-sm mb-4">
        <CardHeader>
          <CardTitle>Panel de Control</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <DataSelector
            attributes={attributes}
            selectedAttribute={selectedAttribute}
            selectedDataType={selectedDataType}
            onAttributeChange={handleAttributeChange}
          /> */}
          <ControlPanel
            totalBar={totalBar}
            columns={attributes}
            selectedXAxis={selectedAttribute}
            selectedDataKeys={selectedDataKeys}
            onXAxisChange={handleAttributeChange}
            onDataKeyChange={handleDataKeyChange}
            onTotalBarChange={handleTotalBarChange}
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

export default BarView;
