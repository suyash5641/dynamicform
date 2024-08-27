export type FieldType =
  | "text"
  | "large-text"
  | "number"
  | "url"
  | "phone"
  | "single-select"
  | "multi-select";

export interface IField {
  id: string;
  type: FieldType;
  question: string;
  description?: string;
  options?: string[];
}

export interface IFieldSchema {
  type: FieldType;
  question: string;
  description?: string;
  options?: string[];
}
