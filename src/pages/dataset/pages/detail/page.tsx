import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { DatasetAdapter } from "@/adapters/ckan";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { cn } from "@/lib/utils";
import { BaseRoutes, DatasetRoutes } from "@/models";
import { Dataset } from "@/models/ckan";
import { getDataset } from "@/services/ckan";
import { formatDate, formatDate_DD_MMMM_YYYY } from "@/utils";
import { AddResource } from "./components/add-resource";

import { ExternalLinkIcon } from "lucide-react";
import { ResourceCard } from "./components/resource-card";

export function Detail() {
  const url = useParams().url ?? "";
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<Dataset | undefined>();
  const { callEndpoint: loadDataset, loading } = useFetchAndLoader(useState);

  if (!url) navigate(BaseRoutes.NOT_FOUND, { replace: true });

  useEffectAsync({
    asyncFunction: async () => loadDataset(getDataset(url)),
    successFunction: (data) => setDataset(DatasetAdapter.toDataset(data)),
    errorFunction: () => navigate(BaseRoutes.NOT_FOUND, { replace: true }),
    deps: [url],
  });

  if (loading) return <div>Loading...</div>;
  if (!dataset) return <div>No se encontró el conjunto de datos</div>;

  const detailsTable = [
    { label: "Fuente", value: dataset.source },
    { label: "Autor", value: dataset.author },
    { label: "Mantenedor", value: dataset.maintainer },
    { label: "Categoría", value: dataset.category.label },
    { label: "Licencia", value: dataset.licenseTitle },
    { label: "Estado", value: dataset.state.label },
    { label: "Fecha de creación", value: formatDate_DD_MMMM_YYYY(dataset.created) },
    { label: "Última actualización", value: formatDate_DD_MMMM_YYYY(dataset.modified) },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Dataset details */}
      <div className="container mx-auto px-16 bg-transparent grid gap-y-6">
        {/* Title and description */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-normal my-6 text-start">{dataset.title || dataset.url}</h1>
          {/* Category */}
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-custom-black">Categoría: </p>
            <Link to={DatasetRoutes.BASE()} state={{ category: [dataset.category.value] }}>
              <Badge
                key={`dataset-category-${dataset.id}`}
                variant="secondary"
                className="text-sm px-4 rounded-full font-poppins font-medium"
              >
                <dataset.category.icon className="!size-4 mr-2" />
                {dataset.category.label}
              </Badge>
            </Link>
          </div>
          {/* Tags */}
          {dataset.tags.length > 0 && (
            <div className="flex flex-row gap-2">
              <p className="text-sm text-custom-black">Etiquetas: </p>
              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag) => (
                  <Link
                    key={`tag-${tag.name}`}
                    to={DatasetRoutes.BASE()}
                    state={{ tags: [tag.name] }}
                    // enviar el tag.name como state
                  >
                    <Badge
                      key={`${dataset.id}-${tag.id}`}
                      variant="secondary"
                      className="text-sm px-4 rounded-full font-poppins font-medium"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <span className="text-sm text-custom-black">
            Creado el {formatDate(dataset.created, "year-month-day")}, última actualización el{" "}
            {formatDate(dataset.modified, "year-month-day")}
          </span>

          <p className="text-base text-custom-black">
            {dataset.description || "Este dataset no tiene descripción"}
          </p>
        </div>

        {dataset.resources.length > 0 && (
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-normal text-start">
              Recurso{dataset.resources.length > 1 && "s"}
            </h1>

            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dataset.resources.map((resource) => (
                <li key={`resource-${resource.id}`}>
                  <ResourceCard resource={resource} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional information */}
        <h1 className="text-2xl font-normal text-center">Información adicional</h1>
        <Table className="font-poppins w-fit mx-auto border">
          <TableCaption>Datos del conjunto de datos</TableCaption>
          <TableHeader>
            <TableRow className="text-lg !bg-custom-gray/15">
              <TableHead className="text-black min-w-96">Campo</TableHead>
              <TableHead className="text-black min-w-72">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailsTable.map(
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

        <Separator className="my-4 h-2" />
        <AddResource package_id={dataset.id} />

        <Table className="font-poppins w-fit mx-auto border">
          <TableCaption>Recursos del conjunto de datos{` "${dataset.title}"`}</TableCaption>
          <TableHeader>
            <TableRow className="text-lg !bg-custom-gray/15">
              <TableHead className="text-black min-w-96">Recursos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataset.resources.map(
              (resource) =>
                resource.name && (
                  <TableRow key={`field-${resource.id}`}>
                    <TableCell className="font-medium">{resource.name}</TableCell>
                    <TableCell className="font-medium">
                      <Link
                        to={DatasetRoutes.RESOURCE.replace(":id", resource.id)}
                        state={{ ...resource }}
                        className={cn(buttonVariants({ variant: "ghost" }), "p-0 h-4")}
                      >
                        <ExternalLinkIcon className="h-5 w-5 text-gray-500" />
                      </Link>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dataset groups */}
      {/* <TabsContent value="groups">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold mb-2">Grupos</h1>
          <p className="text-xl text-custom-gray">
            {dataset.groups.map((group) => group.title).join(", ")}
          </p>
        </div>
      </TabsContent> */}

      {/* Dataset activity */}
      {/* <TabsContent value="activity">
        <p className="text-xl text-gray-600">
          Esta página muestra la actividad de un conjunto de datos con sus detalles. Actualmente hay{" "}
          {dataset.numResources} conjuntos de datos en la lista.
        </p>
      </TabsContent> */}
    </div>
    // </div>
  );
}

export default Detail;
