export interface GroupResponse {
  id: string;
  name: string;
  display_name: string;
  title: string;
  description: string;
  image_display_url: string;
  image_url: string;
  created: string;
  approval_status: string;
  is_organization: boolean;
  state: string;
  num_followers: number;
  package_count: number;
}

export interface Group {
  id: string;
  name: string;
  displayName: string;
  title: string;
  description: string;
  imageDisplayUrl: string;
  imageUrl: string;
  created: Date;
  isActive: boolean;
}
