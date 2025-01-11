import { Tag, TagResponse } from "@/models/ckan";
import { StateAdapter } from "./state.adapter";

export class TagAdapter {
  static toTag(tag: TagResponse): Tag {
    return {
      id: tag.id,
      name: tag.name,
      displayName: tag.display_name,
      isActive: StateAdapter.isActive(tag.state),
    };
  }
}
