import { State } from "@/models/ckan";

export class StateAdapter {
  static toState(state: any): State {
    return state === "active" ? "active" : "deleted";
  }

  static isActive(state: State): boolean {
    return state === "active";
  }
}
