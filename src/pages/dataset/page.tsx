import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { DatasetAdapter } from "@/adapters/ckan";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore, useEffectAsync, useFetchAndLoader } from "@/hooks";
import { cn } from "@/lib/utils";
import { DatasetRoutes } from "@/models";
import { Dataset } from "@/models/ckan";
import { getDatasets } from "@/services/ckan";

import { LockClosedIcon } from "@radix-ui/react-icons";

type DatasetsProps = {
  id?: string;
  name?: string;
  tag?: string;
};

export function Datasets() {
  const location = useLocation();
  const { id: _0, name: _1 } = (location.state || {}) as DatasetsProps;
  const { type } = useAuthStore();
  const [items, setItems] = useState<Dataset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = items.length;
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const { callEndpoint: loadDatasets } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () => loadDatasets(getDatasets()),
    successFunction: (data) => setItems(data.map((item) => DatasetAdapter.toDataset(item))),
  });

  const getCurrentItems = (): Dataset[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return (
    <div className="container mx-auto flex flex-col gap-4 px-6 py-8">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-2 mx-auto">Lista de Objetos</h1>
      <p className="text-xl text-gray-600 ~text-center">
        Esta página muestra una colección de Datasets con sus detalles. Actualmente hay {totalItems}{" "}
        conjunto de datos en la lista.
      </p>

      {/* Search and sort */}
      <div className="flex flex-col w-full sm:flex-row justify-between items-center mb-6 gap-4">
        <Input type="search" placeholder="Buscar objetos..." className="!w-full sm:w-64" />
        <Select>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="date">Fecha</SelectItem>
            <SelectItem value="relevance">Relevancia</SelectItem>
          </SelectContent>
        </Select>
        {type && (
          <Link
            className={cn(
              buttonVariants(),
              "bg-custom-primary-2 hover:bg-custom-secondary-2 text-white"
            )}
            to={DatasetRoutes.REGISTER}
          >
            Agregar Conjunto de Datos
          </Link>
        )}
      </div>

      {/* List of items */}
      {getCurrentItems().length > 0 ? (
        <Fragment>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCurrentItems().map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                className="border rounded-lg p-4 bg-white shadow hover:shadow-md hover:shadow-custom-primary-2 transition-all duration-300 ease-in-out hover:scale-105 hover:border-custom-primary-2 hover:bg-custom-primary-2/20"
              >
                <Link to={DatasetRoutes.DETAIL.replace(":url", item.url)}>
                  <div className="flex justify-start items-start gap-4">
                    {item.private && (
                      <div className="flex items-center gap-2 text-custom-black pe-4">
                        <span>Privado</span>
                        <LockClosedIcon className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-3">
                    {item.description || "Este dataset no tiene descripción"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* {item.tags.map((tag) => (
                      <Badge key={`${item.id}-${tag.id}`} variant="secondary">
                        {tag.displayName}
                      </Badge>
                    ))} */}
                    {Array.from(
                      new Set(item.resources.filter((r) => r.format).map((r) => r.format))
                    ).map((format) => (
                      <Badge key={`${item.id}-${format}`} variant="secondary">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-center items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </Fragment>
      ) : (
        <h2 className="text-2xl font-poppins text-center p-20">
          No existe conjuntos de datos para mostrar
        </h2>
      )}
    </div>
  );
}

export default Datasets;
