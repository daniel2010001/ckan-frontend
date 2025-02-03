import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ResourceAdapter, ViewAdapter } from "@/adapters/ckan";
import { DatastoreAdapter } from "@/adapters/ckan/datastore.adapter";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore, useEffectAsync, useFetchAndLoader } from "@/hooks";
import { cn } from "@/lib/utils";
import { BaseRoutes, DatasetRoutes } from "@/models";
import { Datastore, fieldTypes, Resource, timestampFormats, View, viewTypes } from "@/models/ckan";
import { getDatastore, getResource, getResourceViewList } from "@/services/ckan";
import { convertFileSize, formatDate } from "@/utils";
import { BarChart, ControlPanel, DataTable, DonutView, getColumns } from "./components";

import { DownloadIcon, LinkIcon, WrenchIcon } from "lucide-react";

function DataTableViewPage({ resourceId }: { resourceId: string }) {
  const [datastore, setDatastore] = useState<Datastore | undefined>();
  const [selectedXAxis, setSelectedXAxis] = useState<string>("");
  const [selectedDataKeys, setSelectedDataKeys] = useState<Array<string>>([]);
  const [totalBar, setTotalBar] = useState(true);
  const { callEndpoint: loadDatastore, loading } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () => await loadDatastore(getDatastore(resourceId)),
    successFunction: (data) => {
      const datastore = DatastoreAdapter.toDatastore(data);
      setDatastore(datastore);
      setSelectedXAxis(datastore.fields[0].id);
    },
    errorFunction: () => console.log("Error: No se pudo cargar los datos de la tabla"),
    deps: [resourceId],
  });

  const handleXAxisChange = (value: string) => {
    setSelectedDataKeys((prev) => [...prev.filter((k) => k !== value)]);
    setSelectedXAxis(value);
  };
  const handleDataKeyChange = (key: string, isChecked: boolean) => {
    if (isChecked) setSelectedDataKeys([...selectedDataKeys, key]);
    else setSelectedDataKeys(selectedDataKeys.filter((k) => k !== key));
  };
  const handleTotalBarChange = () => setTotalBar((prev) => !prev);

  if (loading) return <div>Loading...</div>;
  if (!datastore) return <div>No se encontró el recurso</div>;
  return (
    <div>
      <Tabs defaultValue="bar-chart">
        <TabsList>
          <TabsTrigger value={"table"}>Tabla</TabsTrigger>
          <TabsTrigger value={"bar-chart"}>Gráfico de barras</TabsTrigger>
          <TabsTrigger value={"donut-chart"}>Gráfico de Donut</TabsTrigger>
        </TabsList>

        {/* Dataset table */}
        <TabsContent value={"table"} className="container mx-auto bg-transparent">
          <DataTable columns={getColumns(datastore.fields)} data={datastore.records} />
        </TabsContent>

        {/* Dataset details */}
        <TabsContent value={"bar-chart"} className="container mx-auto bg-transparent flex gap-4">
          {datastore.records.length > 0 && (
            <BarChart
              data={datastore.records}
              xAxis={selectedXAxis}
              dataKeys={selectedDataKeys}
              totalBar={totalBar}
            />
          )}
          <ControlPanel
            totalBar={totalBar}
            columns={datastore.fields.map((item) => item.id)}
            selectedXAxis={selectedXAxis}
            selectedDataKeys={selectedDataKeys}
            onXAxisChange={handleXAxisChange}
            onDataKeyChange={handleDataKeyChange}
            onTotalBarChange={handleTotalBarChange}
          />
        </TabsContent>

        {/* Pie chart */}
        <TabsContent value="donut-chart" className="container mx-auto bg-transparent">
          <DonutView data={datastore.records} />
        </TabsContent>
      </Tabs>

      {/* Tabla de detalles */}
      <Table>
        <TableCaption>Detalles del Datastore</TableCaption>
        <TableHeader>
          <TableRow className="text-lg !bg-custom-gray/15">
            <TableHead className="text-black">ID</TableHead>
            <TableHead className="text-black">Cabecera</TableHead>
            <TableHead className="text-black">Descripción</TableHead>
            <TableHead className="text-black">Tipo</TableHead>
            <TableHead className="text-black">Unidad</TableHead>
            <TableHead className="text-black">Formato de fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datastore.fields.map(({ id, info, type }) => {
            const { label, notes, unit, type_override, timestamp_format } = info || {};
            const fieldType = Object.values(fieldTypes).find(
              ({ value }) => value === type_override || (!type_override && value === type)
            );
            const timestampFormat = Object.values(timestampFormats).find(
              ({ value }) => value === timestamp_format
            );
            return (
              <TableRow key={`field-${id}`}>
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell>{label || id}</TableCell>
                <TableCell>{notes || "-"}</TableCell>
                <TableCell>{fieldType?.label || "-"}</TableCell>
                <TableCell>{unit || "-"}</TableCell>
                <TableCell>{timestampFormat?.label || "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function TablaDetails({ view }: { view: View }) {
  return (
    <Table>
      <TableCaption>Detalles de la vista: {view.title}</TableCaption>
      <TableHeader>
        <TableRow className="text-lg !bg-custom-gray/15">
          <TableHead className="text-black min-w-96">Campo</TableHead>
          <TableHead className="text-black min-w-72">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(view).map(
          ([key, value]) =>
            !!value && (
              <TableRow key={`view-${view.title}-${key}`}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>{value.toString() || "No se encontró ningún valor"}</TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
}

export function ResourcePage() {
  const id = useParams().id ?? "";
  const location = useLocation();
  const navigate = useNavigate();
  const { type: isLogged } = useAuthStore();
  const [resource, setResource] = useState<Resource | undefined>(() => location.state);
  const [resourceViews, setResourceViews] = useState<View[]>([]);
  const { callEndpoint: loadResource, loading } = useFetchAndLoader(useState);
  const { callEndpoint: loadView, loading: loadingView } = useFetchAndLoader(useState);

  if (!id) navigate(BaseRoutes.NOT_FOUND, { replace: true });

  useEffectAsync({
    asyncFunction: () =>
      loadResource(resource ? ({} as ReturnType<typeof getResource>) : getResource(id)),
    successFunction: (data) => setResource(ResourceAdapter.toResource(data)),
    errorFunction: () => !resource && navigate(BaseRoutes.NOT_FOUND, { replace: true }),
    deps: [id],
  });

  useEffectAsync({
    asyncFunction: async () => await loadView(getResourceViewList(id)),
    successFunction: (data) => setResourceViews(data.map(ViewAdapter.toView)),
    errorFunction: () => navigate(BaseRoutes.NOT_FOUND, { replace: true }),
    deps: [id],
  });

  if (loading || loadingView) return <div>Loading...</div>;
  if (!resource) return <div>No se encontró el recurso</div>;

  const resourceDetails = [
    { label: "ID", value: resource.id },
    { label: "Formato", value: resource.format },
    { label: "Tamaño", value: convertFileSize(resource.size, "B", "KB") },
    { label: "Tipo", value: resource.mimetype },
    { label: "Fecha de creación", value: formatDate(resource.created, "year-month-day-weekday") },
    {
      label: "Fecha de última modificación",
      value: formatDate(resource.lastModified, "year-month-day-weekday"),
    },
    {
      label: "Fecha de última actualización",
      value: formatDate(resource.metadataModified, "year-month-day-weekday"),
    },
  ];

  const tabs: Array<{ label: string; value: string; disabled?: boolean }> = [
    { label: "Detalles", value: "details" },
    ...resourceViews.map((view) => ({ label: view.title, value: view.title })),
  ];

  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Enlace copiado"))
      .catch(() => toast.error("Error al copiar el enlace"));
  };

  return (
    <div className="container mx-auto flex flex-col gap-8 px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={copyLink}>
            <LinkIcon width={20} height={20} />
          </Button>
          {resource.name}
        </h1>
        <div className="flex gap-4">
          <Link to=".." className={cn(buttonVariants({ variant: "outline" }))}>
            Ver dataset
          </Link>
          <Link
            to={resource.url}
            className={cn(buttonVariants({ variant: "outline" }))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar
            <DownloadIcon className="size-4" />
          </Link>
          {isLogged && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
                  Manager
                  {/* Un ícono de herramienta para mostrar el menú desplegable */}
                  <WrenchIcon className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem disabled>Editar recurso</DropdownMenuItem>
                  <DropdownMenuItem disabled>Crear vista</DropdownMenuItem>
                  {resource.datastoreActive && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Datastore</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to={DatasetRoutes.DICTIONARY} state={resource}>
                          Editar diccionario
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={DatasetRoutes.NEW_CHART} state={resource}>
                          Crear nuevo gráfico
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {resource.description && <p className="">{resource.description}</p>}

      {/* Add tabs para los detalles y las vistas */}
      <Tabs defaultValue="details" className="w-full h-full flex flex-col">
        <TabsList className="flex w-full justify-start h-navbar-height bg-transparent border-0 border-b-[1px]">
          {tabs.map(({ value, label, disabled }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="text-xl mx-4 !border-none !shadow-none"
              disabled={disabled}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="details" className="flex flex-col gap-4">
          <Table>
            <TableCaption>Datos del recurso</TableCaption>
            <TableHeader>
              <TableRow className="text-lg !bg-custom-gray/15">
                <TableHead className="text-black min-w-96">Campo</TableHead>
                <TableHead className="text-black min-w-72">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceDetails.map(
                ({ label, value }, index) =>
                  !!value && (
                    <TableRow key={`field-${index}`}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Tab for views */}
        {resourceViews.map((view) => (
          <TabsContent key={`view-${view.title}`} value={view.title}>
            {view.type === viewTypes.TABLE.value && <DataTableViewPage resourceId={resource.id} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default ResourcePage;
