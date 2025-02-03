import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { DatasetAdapter } from "@/adapters/ckan";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/hooks";
import { cn } from "@/lib/utils";
import { DatasetRoutes, Option } from "@/models";
import { AdvancedSearchDatasetType, orderBy, OrderBy, SearchDatasetRequest } from "@/models/ckan";
import { FilterSearch } from "./filter-search";

import { Search } from "lucide-react";

interface SearchInputProps {
  setPayload: (data: SearchDatasetRequest) => void;
}

export function SearchInput({ setPayload }: SearchInputProps) {
  const { type: isLogged } = useAuthStore();
  const location = useLocation();
  const state = location.state as AdvancedSearchDatasetType & { sortBy: OrderBy; q: string };
  const [query, setQuery] = useState(state?.q ?? "");
  const [search, setSearch] = useState<AdvancedSearchDatasetType>(state ?? {});
  const [sortBy, setSortBy] = useState<OrderBy>(orderBy.RELEVANCE.value);

  const payload = useMemo(
    () => ({
      q: query || undefined,
      fq: DatasetAdapter.toFilterQuery(search) || undefined,
      sort: sortBy,
      // TODO: Ver cómo agregar esto en la interfaz
      include_private: true,
      include_drafts: false,
      include_deleted: false,
    }),
    [query, search, sortBy]
  );

  useEffect(() => {
    setPayload(payload);
  }, [payload, setPayload]);

  // TODO: Revisar por qué no se puede mandar la set function directamente
  function handleSortBy(value: OrderBy) {
    setSortBy(value);
  }

  return (
    <div className="flex w-full sm:flex-row items-center gap-4">
      <div className="relative flex items-center w-full">
        <Input
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && setPayload(payload)}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-10"
          onClick={() => setPayload(payload)}
        >
          <Search className="h-4 w-4" />
        </Button>
        <FilterSearch defaultValues={search} onSubmit={setSearch} className="absolute right-1" />
      </div>

      <Select onValueChange={handleSortBy} defaultValue={state?.sortBy ?? sortBy}>
        <SelectTrigger className="w-full sm:min-w-52 sm:w-52">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {Object.values<Option>(orderBy).map((order) => (
            <SelectItem key={`order-by-${order.value}`} {...order}>
              {order.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLogged && (
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
  );
}
