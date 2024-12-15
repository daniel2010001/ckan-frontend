import { State } from ".";

export interface TagResponse {
  id: string;
  name: string;
  display_name: string;
  state: State;
  vocabulary_id: string | null;
}

export interface Tag {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
}
