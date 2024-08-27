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
        options:
          type === "single-select" || type === "multi-select"
            ? ["Option 1", "Option 2"]
            : [],
      };
      state.fields.push(newField);
    },
    copyField(state, action: PayloadAction<string>) {
      const id = action.payload;
      const fieldToCopy = state.fields.find((field) => field.id === id);
      if (fieldToCopy) {
        const newField = { ...fieldToCopy, id: uuidv4() };
        state.fields.push(newField);
      }
    },
    deleteField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter(
        (field) => field.id !== action.payload
      );
    },
    updateField(
      state,
      action: PayloadAction<{ id: string; key: keyof IField; value: string }>
    ) {
      const { id, key, value } = action.payload;
      const fieldIndex = state.fields.findIndex((field) => field.id === id);
      if (fieldIndex !== -1) {
        state.fields[fieldIndex] = {
          ...state.fields[fieldIndex],
          [key]: value,
        };
      }
    },
    updateFieldOptions(
      state,
      action: PayloadAction<{ id: string; options: string[] }>
    ) {
      const { id, options } = action.payload;
      const fieldIndex = state.fields.findIndex((field) => field.id === id);
      if (fieldIndex !== -1) {
        state.fields[fieldIndex] = { ...state.fields[fieldIndex], options };
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
} = formSlice.actions;

export default formSlice.reducer;
