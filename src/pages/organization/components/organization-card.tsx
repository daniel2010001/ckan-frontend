import { Link } from "react-router-dom";

import { Organization } from "@/models/ckan";
import { OrganizationRoutes } from "@/models";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link to={OrganizationRoutes.DETAIL.replace(":name", organization.name)}>
      <div className="h-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img
          src={organization.image}
          alt={organization.name}
          width={100}
          height={100}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <div className="w-full flex justify-between mb-2">
            <span className="inline-block bg-custom-primary-4/20 text-custom-primary-3 text-xs px-2 py-1 rounded-full">
              {organization.type.label}
            </span>
            <span className="text-gray-600 text-sm">Datasets: {organization.datasets}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{organization.title}</h2>
          <p className="text-gray-600 line-clamp-2">{organization.description}</p>
        </div>
      </div>
    </Link>
  );
}
