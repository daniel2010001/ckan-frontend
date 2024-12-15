import { View, ViewResponse } from "@/models/ckan";

export class ViewAdapter {
  static toView(view: ViewResponse): View {
    return {
      id: view.id,
      title: view.title,
      description: view.description,
      type: view.view_type,
      packageId: view.package_id,
      resourceId: view.resource_id,
    };
  }
}
