import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DatasetRoutes, Option } from "@/models";
import { Categories, DatasetForm, datasetSchema } from "@/models/ckan";
import { createDatasets, getLicenses } from "@/services/ckan";
import { getMyGroups } from "@/services/ckan/group.service";
import { getMyOrganizations } from "@/services/ckan/organization.service";
import { getTags } from "@/services/ckan/tags.service";
import { extractDefaultValues, loadAbortable, transformToPath } from "@/utils";

import { Combobox } from "@/components/ui/combobox";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  name: keyof z.infer<typeof datasetSchema>;
  label: string;
  placeholder?: string;
};

const FormLayout: Array<FormItemType> = [
  { type: "text", name: "title", label: "Título", placeholder: "ej. Datos Abiertos" },
  { type: "text", name: "path", label: "Nombre", placeholder: "ej. datos-abiertos" }, // TODO: autocomplete de acuerdo título
  {
    type: "textarea",
    name: "description",
    label: "Descripción",
    placeholder: "ej. Datos Abiertos",
  },
  { type: "select", name: "category", label: "Categoría", placeholder: "ej. Economía y finanzas" },
  { type: "combobox", name: "tags", label: "Etiquetas", placeholder: "ej. datos, abiertos" },
  { type: "select", name: "license", label: "Licencia", placeholder: "ej. CC-BY-4.0" },
  { type: "checkbox", name: "private", label: "Mantener privado" },
  {
    type: "select",
    name: "organization",
    label: "Organización",
    placeholder: "ej. Gobierno Autónomo Municipal de Cochabamba",
  },
  { type: "combobox", name: "groups", label: "Grupos", placeholder: "ej. Secretaría de Salud" },
  { type: "text", name: "source", label: "Fuente", placeholder: "ej. https://datos.com" },
  { type: "text", name: "version", label: "Versión", placeholder: "ej. 1.0" },
  { type: "text", name: "author", label: "Autor", placeholder: "ej. Daniel Hernandez" },
  {
    type: "text",
    name: "authorEmail",
    label: "Correo electrónico del autor",
    placeholder: "ej. daniel@hernandez.com",
  },
  { type: "text", name: "maintainer", label: "Mantenedor", placeholder: "ej. Daniel Hernandez" },
  {
    type: "text",
    name: "maintainerEmail",
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
  field: ControllerRenderProps<z.infer<typeof datasetSchema>>;
  placeholder?: string;
}) {
  const navigate = useNavigate();
  const [options, setOptions] = useState<Array<Option>>([]);

  useEffect(() => {
    const loadLicenses = async () => {
      const response = await loadAbortable(getLicenses());
      if (!response || response instanceof Error)
        return toast.error("No se pudieron cargar las licencias");
      setOptions(response.data.map(({ title, id }) => ({ label: title, value: id })));
    };
    const loadOrganizations = async () => {
      const response = await loadAbortable(getMyOrganizations("create_dataset"));
      if (!response || response instanceof Error)
        return toast.error("No se pudieron cargar las organizaciones");
      if (response.data.length === 0) navigate(DatasetRoutes.BASE());
      setOptions(response.data.map(({ name, title }) => ({ label: title, value: name })));
    };
    const loadGroups = async () => {
      const response = await loadAbortable(getMyGroups());
      if (!response || response instanceof Error)
        return toast.error("No se pudieron cargar los grupos");
      setOptions(
        response.data.map(({ name, display_name }) => ({ label: display_name, value: name }))
      );
    };
    const loadTags = async () => {
      const response = await loadAbortable(getTags());
      if (!response || response instanceof Error)
        return toast.error("No se pudieron cargar las etiquetas");
      setOptions(
        response.data.map(({ name, display_name }) => ({ label: display_name, value: name }))
      );
    };

    switch (field.name) {
      case "organization":
        loadOrganizations();
        break;
      case "groups":
        loadGroups();
        break;
      case "license":
        loadLicenses();
        break;
      case "tags":
        loadTags();
        break;
      case "category":
        setOptions(Object.values<Option>(Categories));
        break;
      default:
        break;
    }
  }, [field.name, navigate]);

  switch (type) {
    case "select":
      if (options.length === 1) {
        field.onChange(options[0].value);
        return null;
      }
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ label, value }, index) => (
              <SelectItem key={`select-item-${index}`} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "combobox": {
      const handleAddTag = (newTag: string) => {
        setOptions((prev) => [{ label: newTag, value: newTag }, ...prev]);
        field.onChange([...(field.value as string[]), newTag]);
      };
      return (
        <Combobox
          onChange={field.onChange}
          value={field.value as string[]}
          placeholder={placeholder}
          options={options}
          addNewOption={handleAddTag}
          multiple
          showTags
        />
      );
    }
    case "checkbox":
      return <Switch checked={!!field.value} onCheckedChange={field.onChange} />;
    case "textarea":
      return (
        <Textarea
          {...field}
          value={field.value as string}
          placeholder={placeholder}
          className="resize-none border-custom-gray bg-white"
        />
      );
    default: // text
      return (
        <Input
          {...field}
          value={field.value as string}
          placeholder={placeholder}
          className="border-custom-gray !text-sm bg-white"
        />
      );
  }
}

export function Register() {
  const navigate = useNavigate();
  const [isPathEdited, setIsPathEdited] = useState(false);

  const form = useForm<DatasetForm>({
    resolver: zodResolver(datasetSchema),
    defaultValues: extractDefaultValues(datasetSchema),
  });

  const { watch, setValue } = form;
  const title = watch("title");
  const path = watch("path");

  useEffect(() => {
    if (!isPathEdited) setValue("path", transformToPath(title ?? ""));
  }, [title, isPathEdited, setValue]);

  useEffect(() => {
    if (path && transformToPath(title) === path) setIsPathEdited(false);
  }, [title, path]);

  const onSubmit = async (data: DatasetForm) => {
    const payload = {
      name: data.path,
      title: data.title || undefined,
      private: data.private,
      notes: data.description || undefined,
      url: data.source || undefined,
      version: data.version || undefined,
      author: data.author || undefined,
      author_email: data.authorEmail || undefined,
      maintainer: data.maintainer || undefined,
      maintainer_email: data.maintainerEmail || undefined,
      license: data.license || undefined,
      tags: data.tags.map((tag) => ({ name: tag })),
      extras: [{ key: "category", value: data.category }],
      owner_org: data.organization,
    };
    const response = await loadAbortable(createDatasets(payload));
    if (!response || response instanceof Error) return toast.error("Error creating dataset");
    navigate(DatasetRoutes.BASE(DatasetRoutes.DETAIL.replace(":url", data.path)));
    toast.success("Dataset created successfully", {
      description: "Se ha creado el dataset con éxito. Puedes verlo en la página de tus datasets.",
      action: { label: "Datasets", onClick: () => navigate(DatasetRoutes.BASE()) },
    });
  };

  return (
    <div className="container mx-auto flex flex-col bg-transparent px-20">
      <div
        className={cn(
          "mx-16 my-10 py-10 flex flex-col items-center justify-center",
          "border-2 border-custom-gray rounded-xl"
        )}
      >
        {/* Title */}
        <h1 className="text-[40px] pb-10 text-center text-custom-secondary-2 font-poppins font-medium">
          CREAR CONJUNTO DE DATOS
          <Separator className="mt-4 h-[2px]" />
        </h1>

        {/* Form */}
        <Form {...form}>
          <form className="w-full grid gap-8 px-32" autoComplete="off">
            {FormLayout.map(({ name, label, placeholder, type }, index) => (
              <FormField
                key={`form-item-${index}-${name}`}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl mr-16 text-custom-black">{label}</FormLabel>
                    <FormControl>
                      <InputType type={type} field={field} placeholder={placeholder} />
                    </FormControl>
                    <FormMessage className="font-poppins" />
                  </FormItem>
                )}
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
    </div>
  );
}

export default Register;
