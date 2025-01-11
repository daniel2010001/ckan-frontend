import { Group, GroupResponse } from "@/models/ckan/group.model";

export class GroupAdapter {
  static toGroup(group: GroupResponse): Group {
    return {
      id: group.id,
      name: group.name,
      displayName: group.display_name,
      title: group.title,
      description: group.description,
      imageDisplayUrl: group.image_display_url,
      imageUrl: group.image_url,
      created: new Date(group.created),
      isActive: group.state === "active",
    };
  }
}
