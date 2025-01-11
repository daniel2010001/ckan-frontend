import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { OrganizationAdapter, TagAdapter } from "@/adapters/ckan";
import { GroupAdapter } from "@/adapters/ckan/group.adapter";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import {
  AdvancedSearchDatasetSchema,
  AdvancedSearchDatasetType,
  Categories,
} from "@/models/ckan/dataset.model";
import { Group } from "@/models/ckan/group.model";
import { Organization } from "@/models/ckan/organization.model";
import { Tag } from "@/models/ckan/tag.model";
import { getGroups } from "@/services/ckan/group.service";
import { getOrganizations } from "@/services/ckan/organization.service";
import { getTags } from "@/services/ckan/tags.service";

import { Filter } from "lucide-react";

interface FilterSearchProps {
  defaultValues?: AdvancedSearchDatasetType;
  onSubmit: (data: AdvancedSearchDatasetType) => void;
  className?: string;
}

export function FilterSearch({ defaultValues, onSubmit, className }: FilterSearchProps) {
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const { callEndpoint: loadOrganizations } = useFetchAndLoader(useState);
  const { callEndpoint: loadGroups } = useFetchAndLoader(useState);
  const { callEndpoint: loadTags } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () => await loadOrganizations(getOrganizations()),
    successFunction: (data) => setOrganizations(data.map(OrganizationAdapter.toOrganization)),
  });

  useEffectAsync({
    asyncFunction: async () => await loadGroups(getGroups()),
    successFunction: (data) => setGroups(data.map(GroupAdapter.toGroup)),
  });

  useEffectAsync({
    asyncFunction: async () => await loadTags(getTags()),
    successFunction: (data) => setTags(data.map(TagAdapter.toTag)),
  });

  const formEmpty = {
    title: "",
    category: [],
    tags: [],
    organization: [],
    groups: [],
  };

  const form = useForm({
    resolver: zodResolver(AdvancedSearchDatasetSchema),
    defaultValues: { ...formEmpty, ...defaultValues },
  });

  function handleSubmit(data: AdvancedSearchDatasetType) {
    onSubmit(data);
    setOpen(false);
  }

  function handleClear() {
    form.reset(formEmpty);
    onSubmit({});
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className={className}>
          <Filter className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle className="w-full text-xl text-center">Filtros</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Categoría</FormLabel>
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    options={Object.values(Categories)}
                    placeholder="Selecciona la categoría"
                    className="col-span-3"
                    multiple
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Etiqueta</FormLabel>
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    options={tags.map((t) => ({ value: t.name, label: t.displayName }))}
                    placeholder="Selecciona las etiquetas"
                    className="col-span-3"
                    multiple
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="organization"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Organización</FormLabel>
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    options={organizations.map((o) => ({ value: o.name, label: o.title }))}
                    placeholder="Selecciona la organización"
                    className="col-span-3"
                    multiple
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="groups"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Grupos</FormLabel>
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    options={groups.map((g) => ({ value: g.name, label: g.title }))}
                    placeholder="Selecciona el grupo"
                    className="col-span-3"
                    multiple
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex !justify-between gap-4">
              <Button type="button" onClick={handleClear} variant="outline">
                Borrar filtros
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Buscando..." : "Buscar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
