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

import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { transformToPath } from "@/utils";

interface BaseComboboxProps {
  options: Option[];
  placeholder?: string;
  empty?: React.ReactNode;
  addNewOption?: (value: string) => void;
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
  const { value, onChange, options, className, multiple, showTags, addNewOption } = props;
  const { placeholder = "Selecciona una opción", empty = "No hay opciones disponibles" } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

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
    setOpen(false);
  }

  function handleAddNewOption() {
    addNewOption?.(query);
    setOpen(false);
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
        <PopoverContent className={cn("w-full p-0", className)}>
          <Command className="z-[60] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2">
            <CommandInput placeholder={placeholder} className="h-9" onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty
                className={cn(
                  "text-center text-sm flex items-center justify-center pt-2 px-2",
                  typeof empty === "string" && !addNewOption && "py-6"
                )}
              >
                {(addNewOption && (
                  <Button variant="outline" className="w-full" onClick={handleAddNewOption}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir
                  </Button>
                )) ||
                  empty}
              </CommandEmpty>
              <CommandGroup className="flex flex-col gap-1">
                {options.map((option, index) => (
                  <CommandItem
                    key={`combobox-${transformToPath(label)}-${index}-${transformToPath(
                      option.value
                    )}`}
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
      {multiple && showTags && value.length > 1 && (
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
