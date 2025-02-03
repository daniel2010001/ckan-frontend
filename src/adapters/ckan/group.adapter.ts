import { Group, GroupResponse } from "@/models/ckan/group.model";
import { StateAdapter } from "./state.adapter";

import placeholderImage from "@/assets/images/placeholder.png";

export class GroupAdapter {
  static toGroup(group: GroupResponse): Group {
    return {
      id: group.id,
      name: group.name,
      displayName: group.display_name,
      title: group.title,
      description: group.description,
      imagen: group.image_display_url || placeholderImage,
      created: new Date(group.created),
      state: StateAdapter.toState(group.state),
    };
  }
}
