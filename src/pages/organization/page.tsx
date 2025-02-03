import { OrganizationAdapter } from "@/adapters/ckan";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { Organization } from "@/models/ckan";
import { getOrganizations } from "@/services/ckan/organization.service";
import { useState } from "react";
import { OrganizationCard } from "./components/organization-card";

export function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { callEndpoint: loadOrganizations, loading } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () => await loadOrganizations(getOrganizations()),
    successFunction: (data) => setOrganizations(data.map(OrganizationAdapter.toOrganization)),
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="font-poppins font-semibold text-5xl text-custom-primary-4">Organizations</h1> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {organizations.map((org) => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
      </div>
    </div>
  );
}

export default Organizations;
