import { GroupRoutes } from "@/models";
import { Group } from "@/models/ckan/group.model";
import { Link } from "react-router-dom";

export function GroupCard({ group }: { group: Group }) {
  return (
    <Link to={GroupRoutes.DETAIL.replace(":name", group.name)}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <img
          src={group.imagen}
          alt={group.name}
          width={100}
          height={100}
          className="w-full h-40 object-cover"
        />
        <div className="p-4 flex-grow flex flex-col">
          <h2 className="text-xl font-semibold mb-2">{group.title}</h2>
          <p className="text-gray-600 mb-2 flex-grow line-clamp-3">{group.description}</p>
        </div>
      </div>
    </Link>
  );
}
