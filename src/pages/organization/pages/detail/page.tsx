import { OrganizationAdapter } from "@/adapters/ckan";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { BaseRoutes } from "@/models";
import { Organization } from "@/models/ckan";
import { getOrganization } from "@/services/ckan/organization.service";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

export function OrganizationDetailPage() {
  const name = useParams().name ?? "";
  const navigate = useNavigate();
  const location = useLocation();
  const [organization, setOrganization] = useState<Organization | undefined>(() => location.state);
  const { callEndpoint: loadOrganization, loading } = useFetchAndLoader(useState);

  if (!name) navigate(BaseRoutes.NOT_FOUND, { replace: true });

  useEffectAsync({
    asyncFunction: () => loadOrganization(getOrganization(name)),
    successFunction: (data) => setOrganization(OrganizationAdapter.toOrganization(data)),
    errorFunction: () => navigate(BaseRoutes.NOT_FOUND, { replace: true }),
  });

  if (loading) return <div>Loading...</div>;
  if (!organization) return <div>Organization not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to=".." className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver a la lista
      </Link>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={organization.image}
          alt={organization.name}
          width={200}
          height={200}
          className="w-full h-60 object-cover"
        />
        <div className="p-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
            {organization.type.label}
          </span>
          <h1 className="text-3xl font-bold mb-4">{organization.title}</h1>
          <p className="text-gray-600">{organization.description}</p>
        </div>
      </div>
    </div>
  );
}
