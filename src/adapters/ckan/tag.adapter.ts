import { Tag } from "@/models/ckan";
import { StateAdapter } from "./state.adapter";

export class TagAdapter {
  static toTag(tag: any): Tag {
    return {
      id: tag.id,
      name: tag.name,
      displayName: tag.display_name,
      isActive: StateAdapter.isActive(tag.state),
    };
  }
}
