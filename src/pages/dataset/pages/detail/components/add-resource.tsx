import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractDefaultValues, loadAbortable } from "@/utils";
import { createResource } from "@/services/ckan";

import { Loader2 } from "lucide-react";

const maxFileSize = 1048576 * 5;

const schema = z.object({
  name: z
    .string({
      required_error: "El nombre de usuario es requerido",
      invalid_type_error: "El nombre de usuario debe ser de tipo string",
    })
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .default(""),
  description: z
    .string({ invalid_type_error: "La contraseña debe ser de tipo string" })
    .max(100, "La descripción debe tener como máximo 100 caracteres")
    .optional()
    .default(""),
  upload: z.instanceof(File).refine((file) => file.size <= maxFileSize, {
    message: `El archivo debe ser menor a ${maxFileSize / 1024}KB`,
    path: ["upload"],
  }),
});

interface AddResourceProps {
  package_id: string;
}

export function AddResource({ package_id }: AddResourceProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: extractDefaultValues(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await loadAbortable(createResource({ package_id, ...data }));
    if (!response || response instanceof Error) return;
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar recurso</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Agregar recurso</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">Nombre del recurso</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="col-span-3"
                      placeholder="ej. Información de gastos"
                    />
                  </FormControl>
                  <FormMessage className="font-poppins" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      placeholder={"ej. Gastos anuales de la empresa"}
                      className="resize-none border-custom-gray"
                    />
                  </FormControl>
                  <FormMessage className="font-poppins" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="upload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">Archivo</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                      className="col-span-3"
                      type="file"
                    />
                  </FormControl>
                  <FormMessage className="font-poppins" />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            className="bg-custom-primary-2 hover:bg-custom-secondary-2 ml-auto"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Subiendo...
              </>
            ) : (
              "Subir archivo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
