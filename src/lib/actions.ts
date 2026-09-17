/* Shinobi Codex v1.0 — cross-view actions shared by every screen */

import type { ViewId } from "./nav";
import type { Character } from "./types";

export type CategoryDimension = "clan" | "village" | "team" | "classification" | "kekkei" | "rank" | "org" | "nature" | "status" | "blood" | "sex";

export interface CodexActions {
  openCharacter: (character: Character) => void;
  go: (view: ViewId) => void;
  category: (dimension: CategoryDimension, value: string) => void;
}
