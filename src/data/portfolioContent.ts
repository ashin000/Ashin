export type EditableValue = string | number | boolean | string[] | undefined;
export type EditableItem = Record<string, EditableValue>;

export interface PortfolioContent {
  profile: EditableItem;
  about: EditableItem;
  contact: EditableItem;
  stats: EditableItem[];
  experience: EditableItem[];
  skills: EditableItem[];
  projects: EditableItem[];
  certificates: EditableItem[];
  services: EditableItem[];
}
