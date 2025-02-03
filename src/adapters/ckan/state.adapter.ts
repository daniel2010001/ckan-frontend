import { State, states } from "@/models/ckan";

export class StateAdapter {
  static toState(state: string): State {
    switch (state) {
      case states.ACTIVE.value:
        return states.ACTIVE;
      case states.DELETED.value:
        return states.DELETED;
      case states.DRAFT.value:
        return states.DRAFT;
      default:
        return states.INACTIVE;
    }
  }
}
