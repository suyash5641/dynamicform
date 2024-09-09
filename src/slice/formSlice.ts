import { fetchUserFormData } from "@/app/schemaActions";
import { IField, FieldType } from "@/interface/interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface FieldsState {
  fields: IField[];
  loading: boolean;
  error: string | null;
}

const initialState: FieldsState = {
  fields: [],
  loading: true,
  error: null,
};

export const fetchFormFields = createAsyncThunk<
  IField[],
  // { formId: string; userId: string },
  { formId: string },
  { rejectValue: string }
>("fields/fetchFormFields", async ({ formId }, { rejectWithValue }) => {
  try {
    const { data, error } = await fetchUserFormData(formId);
    if (error) throw new Error(error);
    const formData = data?.form_data as IField[];
    console.log(formData, "formdata");
    return formData;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

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
        isRequired: false,
        options:
          type === "single-select" || type === "multi-select" ? ["", ""] : [],
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
          type === "single-select" || type === "multi-select" ? ["", ""] : [],
        rows: type === "multiple-choice-grid" ? ["", ""] : [],
        columns: type === "multiple-choice-grid" ? ["", ""] : [],
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
        answer?: string;
      }>
    ) {
      const { id, options, rows, columns, type, answer } = action.payload;
      console.log(type, answer, "testtt");
      const fieldIndex = state?.fields?.findIndex((field) => field.id === id);
      if (fieldIndex !== -1) {
        // state.fields[fieldIndex] = { ...state.fields[fieldIndex], options };
        if (type === "options") {
          state.fields[fieldIndex].options = options;
        } else if (type === "row") {
          state.fields[fieldIndex].rows = rows;
        } else if (type === "column") {
          state.fields[fieldIndex].columns = columns;
        } else if (type === "answer") {
          if (answer) state.fields[fieldIndex].answer = answer;
        }
      }
    },
    performDrag(state, action: PayloadAction<IField[]>) {
      state.fields = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state (e.g., show loading spinner)
      .addCase(fetchFormFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state (e.g., update fields with fetched data)
      .addCase(
        fetchFormFields.fulfilled,
        (state, action: PayloadAction<IField[]>) => {
          state.fields = action.payload; // Update the fields array with fetched data
          state.loading = false;
        }
      )
      // Handle rejected state (e.g., show error message)
      .addCase(fetchFormFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch form fields";
      });
  },
});

export const {
  addField,
  copyField,
  deleteField,
  updateField,
  updateFieldOptions,
  insertFieldAtPosition,
  performDrag,
} = formSlice.actions;

export default formSlice.reducer;
