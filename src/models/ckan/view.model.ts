import { ValueOf } from "..";

export const ViewType = {
  AUDIO: "audio_view",
  IMAGE: "image_view",
  PDF: "pdf_view",
  TEXT: "text_view",
  VIDEO: "video_view",
  TABLE: "datatables_view",
} as const;
export type ViewType = ValueOf<typeof ViewType>;

export interface ViewResponse {
  id: string;
  resource_id: string;
  title: string;
  description: string;
  view_type: ViewType;
  package_id: string;
  [key: string]: any;
}

export interface View {
  id: string;
  title: string;
  description: string;
  type: ViewType;
  packageId: string;
  resourceId: string;
}
