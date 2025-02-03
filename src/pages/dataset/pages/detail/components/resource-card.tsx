import { Badge } from "@/components/ui/badge";
import { DatasetRoutes } from "@/models";
import { Resource } from "@/models/ckan";
import { useNavigate } from "react-router-dom";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className="w-full h-full flex flex-col border-2 border-custom-gray/20 rounded-xl px-4 py-2 cursor-pointer"
      onClick={() =>
        navigate(DatasetRoutes.RESOURCE.replace(":id", resource.id), { state: { ...resource } })
      }
    >
      {/* Title */}
      <h1 className="text-xl font-medium mr-4">{resource.name}</h1>

      {/* Format in format tag */}
      {resource.format && (
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm text-custom-gray">Formato:</p>
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(DatasetRoutes.BASE(), { state: { format: [resource.format] } });
            }}
          >
            <Badge
              variant="secondary"
              className="text-xs px-4 rounded-full font-poppins font-medium"
            >
              {resource.format}
            </Badge>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-base">{resource.description}</p>
    </div>
  );
}
