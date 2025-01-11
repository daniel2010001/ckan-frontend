import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ResourceAdapter, ViewAdapter } from "@/adapters/ckan";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { cn } from "@/lib/utils";
import { BaseRoutes } from "@/models";
import { Resource as ResourceType, View, ViewType } from "@/models/ckan";
import { getDatastore, getResource, getResourceViewList } from "@/services/ckan";
import { convertFileSize, formatDate_DD_MMMM_YYYY } from "@/utils";
import { BarChart, ControlPanel, DataTable, getColumns, DonutView } from "./components";

import { ExternalLinkIcon, LinkIcon } from "lucide-react";

function DataTableView({ resourceId }: { resourceId: string }) {
  const [data, setData] = useState<Record<string, string | number | boolean>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string>("");
  const [selectedDataKeys, setSelectedDataKeys] = useState<Array<string>>([]);
  const [totalBar, setTotalBar] = useState(true);
  const { callEndpoint: loadDatastore, loading } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () => await loadDatastore(getDatastore(resourceId)),
    successFunction: ({ records, fields }) => {
      setData(records.map(({ _id, ...item }) => item));
      setColumns(fields.filter((item) => item.id !== "_id").map((item) => item.id));
      setSelectedXAxis(fields.filter((item) => item.id !== "_id")[0].id);
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
  return (
    <Tabs defaultValue="bar-chart">
      <TabsList>
        <TabsTrigger value={"table"}>Tabla</TabsTrigger>
        <TabsTrigger value={"bar-chart"}>Gráfico de barras</TabsTrigger>
        <TabsTrigger value={"donut-chart"}>Gráfico de Donut</TabsTrigger>
      </TabsList>

      {/* Dataset table */}
      <TabsContent value={"table"} className="container mx-auto bg-transparent">
        <DataTable columns={getColumns(columns)} data={data} />
      </TabsContent>

      {/* Dataset details */}
      <TabsContent value={"bar-chart"} className="container mx-auto bg-transparent flex gap-4">
        {data.length > 0 && (
          <BarChart
            data={data}
            xAxis={selectedXAxis}
            dataKeys={selectedDataKeys}
            totalBar={totalBar}
          />
        )}
        <ControlPanel
          totalBar={totalBar}
          columns={columns}
          selectedXAxis={selectedXAxis}
          selectedDataKeys={selectedDataKeys}
          onXAxisChange={handleXAxisChange}
          onDataKeyChange={handleDataKeyChange}
          onTotalBarChange={handleTotalBarChange}
        />
      </TabsContent>

      {/* Pie chart */}
      <TabsContent value="donut-chart" className="container mx-auto bg-transparent">
        <DonutView data={data} />
      </TabsContent>
    </Tabs>
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

export function Resource() {
  const id = useParams().id ?? "";
  const location = useLocation();
  const navigate = useNavigate();
  const [resource, setResource] = useState<ResourceType | undefined>(() => location.state);
  const [resourceViews, setResourceViews] = useState<View[]>([]);
  const { callEndpoint: loadResource, loading } = useFetchAndLoader(useState);
  const { callEndpoint: loadView, loading: loadingView } = useFetchAndLoader(useState);

  if (!id) navigate(BaseRoutes.NOT_FOUND, { replace: true });

  useEffectAsync({
    asyncFunction: async () =>
      await loadResource(resource ? ({} as ReturnType<typeof getResource>) : getResource(id)),
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

  if (loading && loadingView) return <div>Loading...</div>;
  if (!resource) return <div>No se encontró el recurso</div>;

  const resourceDetails = [
    { label: "ID", value: resource.id },
    { label: "Formato", value: resource.format },
    { label: "Tamaño", value: convertFileSize(resource.size, "B", "KB") },
    { label: "Tipo", value: resource.mimetype },
    // agregar last_modified, metadata_modified, created
    { label: "Fecha de creación", value: formatDate_DD_MMMM_YYYY(resource.created) },
    {
      label: "Fecha de última modificación",
      value: formatDate_DD_MMMM_YYYY(resource.lastModified),
    },
    {
      label: "Fecha de última actualización",
      value: formatDate_DD_MMMM_YYYY(resource.metadataModified),
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
      <div className="flex items-center gap-4 justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={copyLink}>
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
            Ver archivo del recurso
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </Link>
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
            {view.type === ViewType.TABLE && <DataTableView resourceId={resource.id} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default Resource;
