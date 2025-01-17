"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/models";
import {
  ChartFormData,
  chartFormSchema,
  numberOperations,
  chartTypes,
  Field,
  fieldTypes,
  dateOperations,
  textOperations,
  universalOperations,
} from "@/models/ckan";
import { extractDefaultValues } from "@/utils";

interface ChartFormProps {
  fields: Field[];
  onSubmit: (data: ChartFormData) => void;
}

export default function ChartForm({ fields, onSubmit }: ChartFormProps) {
  const form = useForm<ChartFormData>({
    resolver: zodResolver(chartFormSchema),
    defaultValues: extractDefaultValues(chartFormSchema),
  });

  const { watch } = form;

  function getTypeLabel(type: string) {
    return Object.values(fieldTypes).find(({ value }) => value === type)?.label ?? type;
  }
  const axisOptions: Option[] = fields.map(({ id, info, type }) => ({
    label: `${info?.label || id} ${
      type !== fieldTypes.TEXT.value ? `(${getTypeLabel(type)})` : ""
    }`,
    value: id,
  }));

  function getOptions(): Option[] {
    const field = fields.find(({ id }) => id === watch("yAxis"));
    if (!field) return [];
    switch (field.type) {
      case fieldTypes.TEXT.value:
        return Object.values({ ...universalOperations, ...textOperations });
      case fieldTypes.NUMBER.value:
        return Object.values({ ...universalOperations, ...numberOperations });
      case fieldTypes.TIMESTAMP.value:
        return Object.values({ ...universalOperations, ...dateOperations });
      default:
        return [];
    }
  }
  const options = getOptions();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chart Configuration</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chartType">Tipo de vista</Label>
            <Controller
              name="chartType"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values<Option>(chartTypes)
                      .filter(({ value }) => value.includes("chart"))
                      .map(({ label, value, disabled }) => (
                        <SelectItem key={value} value={value} disabled={disabled}>
                          {label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="xAxis">X Axis</Label>
            <Controller
              name="xAxis"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  onChange={field.onChange}
                  value={field.value}
                  options={axisOptions}
                  placeholder="Selecciona el eje X"
                  multiple
                  showTags
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yAxis">Y Axis</Label>
            <Controller
              name="yAxis"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el eje Y" />
                  </SelectTrigger>
                  <SelectContent>
                    {axisOptions.map(({ label, value, disabled }) => (
                      <SelectItem key={`y-axis-${value}`} value={value} disabled={disabled}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <Controller
              name="operation"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          {/* button reset */}
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpiar
          </Button>
          <Button type="submit">Realizar consulta</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
