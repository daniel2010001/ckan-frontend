import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { extractDefaultValues, loadAbortable } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { createDatasets } from "@/services/ckan";
import { useRef, useState } from "react";
import { BaseRoutes } from "@/models";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const DatasetSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener menos de 100 caracteres")
    .regex(/^[a-z0-9_-]+$/, {
      message:
        "El nombre de usuario solo puede contener caracteres alfanuméricos en minúscula, guiones y guiones bajos",
    })
    .default(""),
  title: z.string().max(100, "El título debe tener menos de 100 caracteres").optional().default(""),
  private: z.boolean().optional().default(false),
  author: z.string().optional().default(""),
  author_email: z.string().optional().default(""),
  maintainer: z.string().optional().default(""),
  maintainer_email: z.string().optional().default(""),
  license: z.string().optional().default(""),
  notes: z
    .string()
    .max(200, "La descripción debe tener menos de 200 caracteres")
    .optional()
    .default(""),
  url: z
    .string({ invalid_type_error: "La url debe ser una cadena de texto" })
    .max(100, "La url debe tener menos de 100 caracteres")
    .optional()
    .default(""),
  version: z.string().optional().default(""),
  tags: z.string().min(3, "Las etiquetas deben tener al menos 3 caracteres").optional().default(""),
  category: z.string().optional().default(""),
  // resources: z.array(z.string()).min(1, "Debe ingresar al menos una url").optional().default([]),
  // groups: z.array(z.string()).min(1, "Debe ingresar al menos un grupo").optional().default([]),
  organization: z.string().optional().default(""),
  owner_org: z.string().default("8d786260-6417-42ed-882d-97dfba9372a4"),
});

export const ResourceSchema = z.object({
  url: z
    .string({
      required_error: "La url es requerida",
      invalid_type_error: "La url debe ser una cadena de texto",
    })
    .min(3, "La url debe tener al menos 3 caracteres")
    .max(100, "La url debe tener menos de 100 caracteres")
    .regex(/^[a-z0-9_-]+$/, {
      message:
        "La url de la fuente solo puede contener caracteres alfanuméricos en minúscula, guiones y guiones bajos",
    })
    .default(""),
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre debe tener menos de 100 caracteres")
    .regex(/^[a-z0-9_-]+$/, {
      message:
        "El nombre de la fuente solo puede contener caracteres alfanuméricos en minúscula, guiones y guiones bajos",
    })
    .default(""),
  description: z
    .string()
    .max(200, "La descripción debe tener menos de 200 caracteres")
    .optional()
    .default(""),
});

type FormItemType = {
  type: "text" | "select" | "textarea" | "checkbox" | "combobox";
  name: keyof z.infer<typeof DatasetSchema>;
  label: string;
  placeholder?: string;
};

const FormLayout: Array<FormItemType> = [
  { type: "text", name: "title", label: "Título", placeholder: "ej. Datos Abiertos" },
  { type: "text", name: "name", label: "Nombre", placeholder: "ej. datos-abiertos" }, // TODO: autocomplete de acuerdo título
  { type: "textarea", name: "notes", label: "Descripción", placeholder: "ej. Datos Abiertos" },
  { type: "text", name: "category", label: "Categoría", placeholder: "ej. Economía y finanzas" },
  { type: "text", name: "tags", label: "Etiquetas", placeholder: "ej. datos, abiertos" },
  { type: "text", name: "license", label: "Licencia", placeholder: "ej. CC-BY-4.0" },
  { type: "checkbox", name: "private", label: "Mantener privado" },
  { type: "text", name: "organization", label: "Organización", placeholder: "ej. datos-abiertos" },
  { type: "text", name: "url", label: "Fuente", placeholder: "ej. https://datos.com" },
  { type: "text", name: "version", label: "Versión", placeholder: "ej. 1.0" },
  { type: "text", name: "author", label: "Autor", placeholder: "ej. Daniel Hernandez" },
  {
    type: "text",
    name: "author_email",
    label: "Correo electrónico del autor",
    placeholder: "ej. daniel@hernandez.com",
  },
  { type: "text", name: "maintainer", label: "Mantenedor", placeholder: "ej. Daniel Hernandez" },
  {
    type: "text",
    name: "maintainer_email",
    label: "Correo electrónico del mantenedor",
    placeholder: "ej. daniel@hernandez.com",
  },
];

function InputType({
  type,
  field,
  placeholder,
}: {
  type: "text" | "select" | "textarea" | "checkbox" | "combobox";
  field: ControllerRenderProps<z.infer<typeof DatasetSchema>>;
  placeholder?: string;
}) {
  switch (type) {
    case "select":
    case "checkbox":
      return <Switch checked={!!field.value} onCheckedChange={field.onChange} />;
    case "textarea":
      return (
        <Textarea
          {...field}
          value={field.value as any}
          placeholder={placeholder}
          className="resize-none border-custom-gray"
        />
      );
    default: // text
      return (
        <Input
          {...field}
          value={field.value as any}
          placeholder={placeholder}
          className="border-custom-gray !text-sm "
        />
      );
  }
}

export function Register() {
  const fnRef = useRef<(e: any) => void>(() => {});
  const [nameChanged, setNameChanged] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof DatasetSchema>>({
    resolver: zodResolver(DatasetSchema),
    defaultValues: extractDefaultValues(DatasetSchema),
  });

  const onSubmit = async (data: z.infer<typeof DatasetSchema>) => {
    const payload = {
      name: data.name,
      title: data.title,
      notes: data.notes,
      url: data.url,
      version: data.version,
      author: data.author,
      author_email: data.author_email,
      maintainer: data.maintainer,
      maintainer_email: data.maintainer_email,
      license: data.license,
      tags: data.tags.split(",").map((item) => ({ name: item.trim() })),
      extras: [{ key: "category", value: data.category }],
      owner_org: data.owner_org,
    };
    const response = await loadAbortable<any, any>(createDatasets(payload));
    if (!response || response instanceof Error) return;
    toast("Dataset created successfully", {
      description: (
        <>Se ha creado el dataset con éxito. Puedes verlo en la página de tus datasets.</>
      ),
      action: {
        label: "Datasets",
        onClick: () => navigate(BaseRoutes.DATASET),
      },
    });
  };

  const handleOnChangeTitle = (fn: (event: any) => void) => {
    return (e: any) => {
      fn(e);
      if (!nameChanged) fnRef.current(e);
      else if (form.watch("name") === e.target.value.toLowerCase().replace(/ /g, "-"))
        setNameChanged(false);
    };
  };

  const handleOnChangeName = (fn: (event: any) => void) => {
    const fn2 = (e: any) => {
      e.target.value = e.target.value.toLowerCase().replace(/ /g, "-");
      fn(e);
    };
    fnRef.current = fn2;
    return (e: any) => {
      fn2(e);
      if (!nameChanged) setNameChanged(true);
    };
  };

  return (
    <div className="container px-16 py-12 mx-auto flex flex-col bg-transparent">
      {/* Title */}
      <h1 className="text-[40px] pb-10 text-center text-custom-secondary-2 font-poppins font-medium">
        CREAR CONJUNTO DE DATOS
        <Separator className="mt-4 h-[2px]" />
      </h1>

      {/* Form */}
      <Form {...form}>
        <form className="grid gap-8 px-32" autoComplete="off">
          {FormLayout.map(({ name, label, placeholder, type }, index) => (
            <FormField
              key={`form-item-${index}-${name}`}
              control={form.control}
              name={name}
              render={({ field }) => {
                if (name === "title") field.onChange = handleOnChangeTitle(field.onChange);
                if (name === "name") field.onChange = handleOnChangeName(field.onChange);
                return (
                  <FormItem>
                    <FormLabel className="text-xl mr-16 text-custom-black">{label}</FormLabel>
                    <FormControl>
                      <InputType type={type} field={field} placeholder={placeholder} />
                    </FormControl>
                    <FormMessage className="font-poppins" />
                  </FormItem>
                );
              }}
            />
          ))}

          <Button
            className="bg-custom-primary-2 hover:bg-custom-secondary-2 ml-auto"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Register;
