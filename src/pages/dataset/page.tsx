"use client";

import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import { DatasetAdapter } from "@/adapters/ckan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { DatasetRoutes } from "@/models";
import { Dataset, SearchDatasetRequest } from "@/models/ckan";
import { searchDatasets } from "@/services/ckan";

import { SearchInput } from "@/components/ui/search-input";
import { LockClosedIcon } from "@radix-ui/react-icons";

export function Datasets() {
  const [payload, setPayload] = useState<SearchDatasetRequest>({});
  const [items, setItems] = useState<Dataset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { callEndpoint: loadDatasets } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () =>
      loadDatasets(
        searchDatasets({
          ...payload,
          rows: itemsPerPage,
          start: (currentPage - 1) * itemsPerPage,
        })
      ),
    successFunction: ({ count, results }) => {
      setTotalItems(count);
      setItems(results.map(DatasetAdapter.toDataset));
    },
    deps: [payload, currentPage],
  });

  return (
    <div className="container mx-auto flex flex-col gap-4 px-6 py-8">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2 mx-auto">Conjuntos de datos</h1>
      <p className="text-xl text-gray-600 ~text-center">
        Esta página muestra una colección de Datasets con sus detalles. Actualmente hay {totalItems}{" "}
        conjunto de datos en la lista.
      </p>

      {/* Search and sort */}
      <div className="flex flex-col w-full sm:flex-row items-center gap-4">
        <SearchInput setPayload={setPayload} />
      </div>

      {/* List of items */}
      {items.length > 0 ? (
        <Fragment>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
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
