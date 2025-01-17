"use client";

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
  fieldInfoSchema,
  fieldTypes,
  FormFieldsData,
  formFieldsSchema,
  timestampFormats,
} from "@/models/ckan/datastore.model";
import { extractDefaultValues } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormFieldsProps {
  fields: Field[];
  onCancel: () => void;
  onSave: (data: FormFieldsData) => void;
  onSaveAndLoad: (data: FormFieldsData) => void;
}

export default function FormFields({ fields, onSave, onCancel, onSaveAndLoad }: FormFieldsProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const form = useForm<FormFieldsData>({
    resolver: zodResolver(formFieldsSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.id] = {
        ...extractDefaultValues(fieldInfoSchema),
        type_override: field.type,
        ...field.info,
      };
      return acc;
    }, {} as FormFieldsData),
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
                  <h3 className="text-lg font-semibold mb-2">
                    {field.info?.label || field.id}
                    <span className="text-sm font-normal ml-2">({field.type})</span>
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">ID: {field.id}</p>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`${field.id}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl mr-16 text-custom-black">Cabecera</FormLabel>
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
                        <FormLabel className="text-xl mr-16 text-custom-black">
                          Descripción
                        </FormLabel>
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
                        <FormLabel className="text-xl mr-16 text-custom-black">
                          Tipo de campo
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(fieldTypes).map(({ label, value }) => (
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
                  {typeOverride === "numeric" && (
                    <FormField
                      control={form.control}
                      name={`${field.id}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl mr-16 text-custom-black">Unidad</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage className="font-poppins" />
                        </FormItem>
                      )}
                    />
                  )}
                  {typeOverride === "timestamp" && (
                    <FormField
                      control={form.control}
                      name={`${field.id}.timestamp_format`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl mr-16 text-custom-black">
                            Formato de fecha
                          </FormLabel>
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
            <Button type="button" variant="default" onClick={handleSave}>
              Guardar
            </Button>
            <Button type="button" variant="destructive" onClick={handleSaveAndContinue}>
              Guardar y cargar
            </Button>
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
