import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RangeSelectorProps {
  isRangeEnabled: boolean;
  selectedDataType: "numeric" | "date" | "time" | "email" | "other";
  numericRange: number;
  dateGroupBy: "year" | "quarter" | "month" | "day";
  timeRange: number;
  onRangeToggle: (checked: boolean) => void;
  onNumericRangeChange: (value: number) => void;
  onDateGroupByChange: (value: "year" | "quarter" | "month" | "day") => void;
  onTimeRangeChange: (value: number) => void;
}

export default function RangeSelector({
  isRangeEnabled,
  selectedDataType,
  numericRange,
  dateGroupBy,
  timeRange,
  onRangeToggle,
  onNumericRangeChange,
  onDateGroupByChange,
  onTimeRangeChange,
}: RangeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="range-mode" checked={isRangeEnabled} onCheckedChange={onRangeToggle} />
        <Label htmlFor="range-mode">Habilitar modo de rango</Label>
      </div>
      {isRangeEnabled && selectedDataType !== "email" && (
        <>
          {selectedDataType === "numeric" && (
            <div className="space-y-2">
              <Label htmlFor="numericRange">Rango numérico:</Label>
              <input
                id="numericRange"
                type="number"
                min="2"
                value={numericRange}
                onChange={(e) => onNumericRangeChange(parseInt(e.target.value, 10))}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          {selectedDataType === "date" && (
            <div className="space-y-2">
              <Label htmlFor="dateGroupBy">Agrupar por:</Label>
              <Select value={dateGroupBy} onValueChange={onDateGroupByChange}>
                <SelectTrigger id="dateGroupBy">
                  <SelectValue placeholder="Selecciona agrupación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Año</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="day">Día</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {selectedDataType === "time" && (
            <div className="space-y-2">
              <Label htmlFor="timeRange">Rango de tiempo:</Label>
              <Select
                value={timeRange.toString()}
                onValueChange={(value) => onTimeRangeChange(parseInt(value, 10))}
              >
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Selecciona rango de tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="20">20 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="180">3 horas</SelectItem>
                  <SelectItem value="240">4 horas</SelectItem>
                  <SelectItem value="360">6 horas</SelectItem>
                  <SelectItem value="720">12 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}
    </div>
  );
}
