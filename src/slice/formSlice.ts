import { IField, FieldType } from "@/interface/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface FieldsState {
  fields: IField[];
}

const initialState: FieldsState = {
  fields: [],
};

const formSlice = createSlice({
  name: "fields",
  initialState,
  reducers: {
    addField(state, action: PayloadAction<FieldType>) {
      const type = action.payload;
      const newField: IField = {
        id: uuidv4(),
        type,
        question: "",
        description: "",
        answer: "",
        isRequired: true,
        options:
          type === "single-select" || type === "multi-select"
            ? ["Option 1", "Option 2"]
            : [],
        rows: type === "multiple-choice-grid" ? ["", ""] : [],
        columns: type === "multiple-choice-grid" ? ["", ""] : [],
      };
      state.fields.push(newField);
    },
    insertFieldAtPosition(
      state,
      action: PayloadAction<{
        type: FieldType;
        index: number;
        insertBelow: boolean;
      }>
    ) {
      const { type, index, insertBelow } = action.payload;
      const newField: IField = {
        id: uuidv4(),
        type,
        question: "",
        description: "",
        answer: "",
        isRequired: true,
        options:
          type === "single-select" || type === "multi-select"
            ? ["Option 1", "Option 2"]
            : [],
      };
      const n = [
        ...state?.fields?.slice(0, insertBelow ? index + 1 : index),
        newField,
        ...state?.fields?.slice(insertBelow ? index + 1 : index),
      ];
      state.fields = n;
    },
    copyField(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state?.fields?.findIndex((field) => field.id === id);
      const fieldToCopy = state.fields[index];

      if (fieldToCopy) {
        const newField = { ...fieldToCopy, id: uuidv4() };
        state?.fields?.splice(index + 1, 0, newField);
      }
    },
    deleteField(state, action: PayloadAction<string>) {
      state.fields = state?.fields?.filter(
        (field) => field.id !== action.payload
      );
    },
    updateField(
      state,
      action: PayloadAction<{
        id: string;
        key: keyof IField;
        value: string | boolean;
      }>
    ) {
      const { id, key, value } = action?.payload;
      const fieldIndex = state?.fields?.findIndex((field) => field.id === id);
      if (fieldIndex !== -1) {
        state.fields[fieldIndex] = {
          ...state.fields[fieldIndex],
          [key]: value,
        };
      }
    },
    updateFieldOptions(
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        options?: string[];
        rows?: string[];
        columns?: string[];
      }>
    ) {
      const { id, options, rows, columns, type } = action.payload;
      const fieldIndex = state?.fields?.findIndex((field) => field.id === id);
      if (fieldIndex !== -1) {
        // state.fields[fieldIndex] = { ...state.fields[fieldIndex], options };
        if (type === "option") {
          state.fields[fieldIndex].options = options;
        } else if (type === "row") {
          state.fields[fieldIndex].rows = rows;
        } else if (type === "column") {
          state.fields[fieldIndex].columns = columns;
        }
      }
    },
  },
});

export const {
  addField,
  copyField,
  deleteField,
  updateField,
  updateFieldOptions,
  insertFieldAtPosition,
} = formSlice.actions;

export default formSlice.reducer;
