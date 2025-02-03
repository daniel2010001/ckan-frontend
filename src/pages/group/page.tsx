"use client";

import { useState } from "react";

// import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { Group } from "@/models/ckan/group.model";
import { getGroups } from "@/services/ckan/group.service";
import { GroupCard } from "./components/group-card";
import { GroupAdapter } from "@/adapters/ckan/group.adapter";

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const { callEndpoint: loadGroups } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () => await loadGroups(getGroups()),
    successFunction: (data) => setGroups(data.map(GroupAdapter.toGroup)),
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Grupos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
      {/* <InfiniteScroll
        onLoadMore={loadMore}
        hasMore={groups.length < initialGroups.length}
        isLoading={isLoading}
      /> */}
    </main>
  );
}
