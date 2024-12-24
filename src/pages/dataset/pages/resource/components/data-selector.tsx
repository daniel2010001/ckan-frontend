import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DataSelectorProps {
  attributes: string[];
  selectedAttribute: string;
  selectedDataType: "numeric" | "date" | "time" | "email" | "other";
  onAttributeChange: (attr: string) => void;
}

export default function DataSelector({
  attributes,
  selectedAttribute,
  selectedDataType,
  onAttributeChange,
}: DataSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Select value={selectedAttribute} onValueChange={onAttributeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un atributo" />
          </SelectTrigger>
          <SelectContent>
            {attributes.map((attr) => (
              <SelectItem key={attr} value={attr}>
                {attr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <span>Tipo de dato:</span>
        <Badge variant={selectedDataType === "other" ? "secondary" : "default"}>
          {selectedDataType === "numeric"
            ? "Numérico"
            : selectedDataType === "date"
            ? "Fecha"
            : selectedDataType === "time"
            ? "Hora"
            : selectedDataType === "email"
            ? "Email"
            : "Otro"}
        </Badge>
      </div>
    </div>
  );
}
