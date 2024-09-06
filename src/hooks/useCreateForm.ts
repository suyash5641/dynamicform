import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IField, FieldType, IFieldSchema, Field } from "@/interface/interface";
import {
  copyField,
  deleteField,
  performDrag,
  updateField,
  updateFieldOptions,
} from "@/slice/formSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

import { createClient } from "@/utils/supabase/client";
import { generateSchemaServer, updateUserForm } from "@/app/schemaActions";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
const supabase = createClient();

export const useCreateForm = () => {
  //   const { formNewId } = useParams();
  //   const { formNewId } = useParams() as { formNewId: string };
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const fields = useSelector((state: RootState) => state?.fields?.fields);

  const handleCopyField = (id: string) => {
    dispatch(copyField(id));
  };

  const handleDeleteField = (id: string) => {
    dispatch(deleteField(id));
  };

  const handleDragAndDrop = (updatedField: IField[]) => {
    dispatch(performDrag(updatedField));
  };

  const handleUpdateField = (
    id: string,
    key: keyof IField,
    value: string | boolean
  ) => {
    dispatch(updateField({ id, key, value }));
  };

  // const handleUpdateFieldOptions = (id: string, options: string[]) => {
  //   dispatch(updateFieldOptions({ id, options }));
  // };

  const handleUpdateFieldOptions = (
    // id: string,
    type: string,
    update: Field
  ) => {
    // console.log({
    //   id,
    //   options: update.options ?? [],
    //   rows: update.rows ?? [],
    //   columns: update.columns ?? [],
    //   fields,
    //   update,
    // });
    dispatch(
      updateFieldOptions({
        id: update?.id,
        options: update?.options ?? [],
        rows: update?.rows ?? [],
        columns: update?.columns ?? [],
        answer: update?.answer ?? "",
        type,
      })
    );
  };

  const user = useSelector((state: RootState) => state?.userInfo?.user);

  // const generateSchema = async () => {
  //   const schemaMap = new Map<string, IFieldSchema>();
  //   const schema: Record<string, IFieldSchema> = {};

  //   const formInfo = {
  //     name: "Customer Feedback Form",
  //     description: "A form to collect feedback from customers",
  //     fieldInfo: fields,
  //   };

  //   await insertForm(formInfo);

  //   return schema;
  // };

  const handleGenerateSchema = async (formNewId: string) => {
    try {
      const formInfo = {
        name: "Customer Feedback Form",
        description: "A form to collect feedback from customers",
        fieldInfo: fields,
        formId: formNewId,
      };
      console.log(fields, formNewId);
      const { error, formId } = await updateUserForm(formInfo, user);
      if (error) throw error;
      router.push(`/form/${formNewId}?isEdit=false&isSubmit=false`);
      //   console.log(formId, "okk");
    } catch (error: any) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return {
    handleCopyField,
    handleGenerateSchema,
    handleUpdateFieldOptions,
    handleUpdateField,
    handleDeleteField,
    handleDragAndDrop,
  };
};
