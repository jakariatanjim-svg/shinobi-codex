export type MaybeArray<T> = T | T[];

export interface Debut {
  manga?: string;
  anime?: string;
  novel?: string;
  movie?: string;
  game?: string;
  ova?: string;
  appearsIn?: string;
}

export interface Personal {
  birthdate?: string;
  sex?: string;
  age?: Record<string, string>;
  height?: Record<string, string>;
  weight?: Record<string, string>;
  bloodType?: string;
  kekkeiGenkai?: MaybeArray<string>;
  classification?: MaybeArray<string>;
  tailedBeast?: string;
  occupation?: MaybeArray<string>;
  affiliation?: MaybeArray<string>;
  team?: MaybeArray<string>;
  clan?: MaybeArray<string>;
  status?: string;
  species?: string;
  partner?: MaybeArray<string>;
  jinchūriki?: MaybeArray<string>;
  titles?: string[];
}

export interface RankInfo {
  ninjaRank?: Record<string, string>;
  ninjaRegistration?: string;
}

export interface VoiceActors {
  japanese?: MaybeArray<string>;
  english?: MaybeArray<string>;
}

export interface CharacterVersion {
  eraLabel: string;
  description: string;
  ageValue: string;
  /** Chakra Index for this specific era, used for the growth curve. */
  powerIndex?: number;
  imageUrl?: string;
  powerContext?: string;
  notes?: string[];
}

export interface Character {
  id: number;
  name: string;
  images?: string[];
  versions?: CharacterVersion[];
  debut?: Debut;
  family?: Record<string, MaybeArray<string>>;
  jutsu?: string[];
  natureType?: string[];
  uniqueTraits?: string[];
  tools?: string[];
  personal?: Personal;
  rank?: RankInfo;
  voiceActors?: VoiceActors;
}

export interface Group {
  id: number;
  name: string;
  characters?: number[];
}

export type Clan = Group;
export type Village = Group;
export type KekkeiGenkai = Group;
export type Team = Group;
export type OrgMember = Character;
export type TailedBeast = Character;

export type CollectionKey =
  | "characters"
  | "clans"
  | "villages"
  | "kekkei-genkai"
  | "tailed-beasts"
  | "teams"
  | "akatsuki"
  | "kara";

export interface Dataset {
  characters: Character[];
  clans: Clan[];
  villages: Village[];
  kekkeiGenkai: KekkeiGenkai[];
  tailedBeasts: TailedBeast[];
  teams: Team[];
  akatsuki: OrgMember[];
  kara: OrgMember[];
}

export type LoadPhase = "idle" | "cache" | "fetching" | "ready" | "error";

export interface LoadState {
  phase: LoadPhase;
  progress: number;
  message: string;
  fromCache: boolean;
  error: string | null;
  counts: Record<CollectionKey, number>;
}
