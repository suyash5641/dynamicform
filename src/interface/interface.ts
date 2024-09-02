export type FieldType =
  | "text"
  | "large-text"
  | "number"
  | "url"
  | "phone"
  | "single-select"
  | "multi-select"
  | "multiple-choice-grid";

export interface IField {
  id: string;
  type: FieldType;
  question: string;
  answer: string;
  isRequired: boolean;
  description?: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
}

export interface IFieldSchema {
  type: FieldType;
  question: string;
  answer: string;
  isRequired: boolean;
  description?: string;
  options?: string[];
}

export interface IForm {
  name: string;
  description: string;
  fieldInfo: IField[];
  formId: string;
}

export interface Field {
  id: string;
  type: FieldType;
  options?: string[];
  rows?: string[];
  columns?: string[]; // Add columns property here
}
