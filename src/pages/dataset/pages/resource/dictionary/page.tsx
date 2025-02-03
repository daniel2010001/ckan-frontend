import { ResourceAdapter } from "@/adapters/ckan";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { BaseRoutes } from "@/models";
import { Field, FormFieldsData, Resource } from "@/models/ckan";
import { createDatastore, getDatastore, getResource, xloaderSubmit } from "@/services/ckan";
import { filterObject, loadAbortable } from "@/utils";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import FormFields from "./components/form-fields";

export default function Dictionary() {
  // TODO: agregar validación de permisos para ver el formulario
  const resourceId = useParams().id ?? "";
  const location = useLocation();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | undefined>(() => location.state);
  const [fields, setFields] = useState<Array<Field>>();
  const { callEndpoint: loadResource, loading } = useFetchAndLoader(useState);
  const { callEndpoint: loadFields, loading: loadingFields } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: () =>
      loadResource(resource ? ({} as ReturnType<typeof getResource>) : getResource(resourceId)),
    successFunction: (data) => setResource(ResourceAdapter.toResource(data)),
    errorFunction: () => !resource && navigate(BaseRoutes.NOT_FOUND, { replace: true }),
    deps: [resourceId],
  });

  useEffectAsync({
    asyncFunction: () => loadFields(getDatastore(resourceId)),
    successFunction: ({ fields }) => setFields(fields.filter((field) => field.id !== "_id")),
    errorFunction: () => navigate(BaseRoutes.NOT_FOUND, { replace: true }),
    deps: [resourceId],
  });

  if (loading || loadingFields) return <div>Loading...</div>;
  if (!fields) return <div>No se encontró el recurso</div>;

  const onCancel = () => navigate("..");
  const updateFields = async (data: FormFieldsData) => {
    const fields = Object.entries(data).map(([id, info]) => ({ id, info: filterObject(info) }));
    const response = await loadAbortable(createDatastore(resourceId, fields));
    if (!response || response instanceof Error)
      return toast.error("Error al guardar el diccionario");
    toast.success("Diccionario guardado");
  };
  const onSave = async (data: FormFieldsData) => {
    await updateFields(data);
    onCancel();
  };
  const onSaveAndLoad = async (data: FormFieldsData) => {
    await updateFields(data);
    const response = await loadAbortable(xloaderSubmit(resourceId));
    if (!response || response instanceof Error || !response.data)
      return toast.error("Error al cargar el recurso");
    toast.success("Recurso cargado");
    onCancel();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Diccionario de {resource?.name}</h1>
      <FormFields
        fields={fields}
        onCancel={onCancel}
        onSave={onSave}
        onSaveAndLoad={onSaveAndLoad}
      />
    </div>
  );
}
