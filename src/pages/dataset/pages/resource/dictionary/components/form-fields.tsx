"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  fieldTypes,
  FormFieldsData,
  formFieldsSchema,
  timestampFormats,
} from "@/models/ckan/datastore.model";

import { AlertTriangle } from "lucide-react";

interface FormFieldsProps {
  fields: Field[];
  onCancel: () => void;
  onSave: (data: FormFieldsData) => void;
  onSaveAndLoad: (data: FormFieldsData) => void;
}

export default function FormFields({ fields, onSave, onCancel, onSaveAndLoad }: FormFieldsProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isTypeChanged, setIsTypeChanged] = useState(false);
  const form = useForm<FormFieldsData>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: fields.reduce<FormFieldsData>((acc, { id, type, info = {} }) => {
      acc[id] = {
        label: info.label ?? "",
        notes: info.notes ?? "",
        unit: info.unit ?? "",
        type_override: info.type_override ?? type ?? "",
        timestamp_format: info.timestamp_format ?? "",
      };
      return acc;
    }, {}),
  });

  const handleCancel = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onCancel();
      form.reset();
    }
  };

  const handleSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    const values = form.getValues();
    onSave(values);
    form.reset();
  };

  const handleSaveAndContinue = async () => {
    const isValid = await form.trigger();
    if (isValid) setIsAlertOpen(true);
  };

  const handleConfirm = () => {
    const values = form.getValues();
    onSaveAndLoad(values);
    setIsAlertOpen(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
          {fields.map((field) => {
            const typeOverride = form.watch(`${field.id}.type_override`);
            return (
              <div
                key={field.id}
                className="border p-4 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {field.info?.label || field.id}
                    <span className="text-sm font-normal ml-2">({field.type})</span>
                  </h3>
                  <p className="text-sm text-custom-gray">ID: {field.id}</p>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`${field.id}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cabecera</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="font-poppins" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${field.id}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="font-poppins" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${field.id}.type_override`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de campo</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setIsTypeChanged(true);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(fieldTypes).map((option) => (
                              <SelectItem key={option.value} {...option}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-poppins" />
                      </FormItem>
                    )}
                  />
                  {typeOverride === fieldTypes.NUMBER.value && (
                    <FormField
                      control={form.control}
                      name={`${field.id}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidad</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage className="font-poppins" />
                        </FormItem>
                      )}
                    />
                  )}
                  {(typeOverride === fieldTypes.DATE.value ||
                    typeOverride === fieldTypes.TIMESTAMP.value) && (
                    <FormField
                      control={form.control}
                      name={`${field.id}.timestamp_format`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Formato de fecha</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(timestampFormats).map(({ label, value }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="font-poppins" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            {isTypeChanged ? (
              <Button type="button" variant="destructive" onClick={handleSaveAndContinue}>
                Guardar y cargar
              </Button>
            ) : (
              <Button type="button" variant="default" onClick={handleSave}>
                Guardar
              </Button>
            )}
          </div>
        </form>
      </Form>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Advertencia
            </AlertDialogTitle>
            <AlertDialogDescription>
              Está a punto de enviar el formulario. Esta acción guardará el diccionario y cargará
              los datos del archivo de acuerdo al tipo especificado, sino es un tipo válido se
              borrará los datos cargados y tendrá que volver a llenar el formulario, pero con los
              tipos correctos.
              <br />
              ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={buttonVariants({ variant: "destructive" })}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
