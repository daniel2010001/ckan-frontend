"use client";

import { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ControlPanelProps {
  totalBar: boolean;
  columns: string[];
  selectedXAxis: string;
  selectedDataKeys: string[];
  onXAxisChange: (value: string) => void;
  onDataKeyChange: (key: string, isChecked: boolean) => void;
  onTotalBarChange: () => void;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  totalBar,
  columns,
  selectedXAxis,
  selectedDataKeys,
  onXAxisChange,
  onDataKeyChange,
  onTotalBarChange,
}) => {
  return (
    <Card className="max-w-sm mb-4">
      <CardHeader>
        <CardTitle>Panel de Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="totalBar" checked={totalBar} onCheckedChange={onTotalBarChange} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Agregar columna total
            </label>
          </div>
          <div>
            <Label htmlFor="xAxis">Eje X</Label>
            <Select value={selectedXAxis} onValueChange={onXAxisChange}>
              <SelectTrigger id="xAxis">
                <SelectValue placeholder="Selecciona el eje X" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Datos a mostrar</Label>
            <div className="space-y-2">
              {columns.map(
                (column) =>
                  column !== selectedXAxis && (
                    <div key={column} className="flex items-center space-x-2">
                      <Checkbox
                        id={column}
                        checked={selectedDataKeys.includes(column)}
                        onCheckedChange={(checked) => onDataKeyChange(column, checked as boolean)}
                      />
                      <Label htmlFor={column}>{column}</Label>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
