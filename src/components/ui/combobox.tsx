import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Option } from "@/models";

import { Check, ChevronsUpDown, X } from "lucide-react";

interface BaseComboboxProps {
  options: Option[];
  placeholder?: string;
  empty?: React.ReactNode;
  tick?: boolean;
  className?: string;
}
interface ComboboxSimpleProps extends BaseComboboxProps {
  value: string;
  onChange: (value: string) => void;
  multiple?: false;
  showTags?: undefined;
}
interface ComboboxMultipleProps extends BaseComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple: true;
  showTags?: boolean;
}
type ComboboxProps = ComboboxSimpleProps | ComboboxMultipleProps;

export function Combobox(props: ComboboxProps) {
  const { value, onChange, options, className, multiple, showTags } = props;
  const { placeholder = "Selecciona una opción", empty = "No hay opciones disponibles" } = props;
  const [open, setOpen] = useState(false);

  function renderLabel() {
    if (!multiple) return options.find((option) => option.value === value)?.label;
    if (value.length > 1) return `${value.length} seleccionados`;
    return options.find((option) => option.value === value[0])?.label;
  }
  const label = renderLabel() || placeholder;

  function handleSelect(optionValue: string) {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else onChange(optionValue);
  }

  function keyConverter(str: string) {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "-");
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {label}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{empty}</CommandEmpty>
              <CommandGroup className="flex flex-col gap-1">
                {options.map((option) => (
                  <CommandItem
                    key={`combobox-${keyConverter(label)}-${keyConverter(option.value)}`}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {multiple && showTags && (
        <div className="flex flex-wrap gap-2">
          {value.map((v) => {
            const option = options.find((opt) => opt.value === v);
            return option ? (
              <Badge key={v} variant="secondary" className="text-sm">
                {option.label}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
                  onClick={() => onChange(value.filter((s) => s !== v))}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Quitar</span>
                </button>
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
