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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const fields = useSelector((state: RootState) => state?.fields?.fields);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCopyField = useCallback(
    (id: string) => {
      dispatch(copyField(id));
    },
    [dispatch]
  );

  const handlePublishForm = useCallback(() => {}, []);

  const handleDeleteField = useCallback(
    (id: string) => {
      dispatch(deleteField(id));
    },
    [dispatch]
  );

  const handleDragAndDrop = useCallback(
    (updatedField: IField[]) => {
      dispatch(performDrag(updatedField));
    },
    [dispatch]
  );

  const handleUpdateField = useCallback(
    (id: string, key: keyof IField, value: string | boolean) => {
      dispatch(updateField({ id, key, value }));
    },
    [dispatch]
  );

  // const handleUpdateFieldOptions = (id: string, options: string[]) => {
  //   dispatch(updateFieldOptions({ id, options }));
  // };

  const handleUpdateFieldOptions = useCallback(
    (
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
    },
    [dispatch]
  );

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

  const handleSuccess = useCallback((formNewId: string) => {
    const url = `/form/${formNewId}?isEdit=false&isSubmit=false`;
    window.open(url, "_blank");
  }, []);

  const handleFormPreview = useCallback(
    async (formNewId: string) => {
      try {
        setIsLoading(true);
        const formInfo = {
          name: "Customer Feedback Form",
          description: "A form to collect feedback from customers",
          fieldInfo: fields,
          formId: formNewId,
        };
        console.log(fields, formNewId);
        const { error, formId } = await updateUserForm(formInfo, user);
        if (error) throw error;
        // router.push(`/form/${formNewId}?isEdit=false&isSubmit=false`);
        handleSuccess(formNewId);
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
      } finally {
        setIsLoading(false);
      }
    },
    [fields, handleSuccess, user]
  );

  return {
    handleCopyField,
    handleFormPreview,
    handleUpdateFieldOptions,
    handleUpdateField,
    handleDeleteField,
    handleDragAndDrop,
    isLoading,
    handlePublishForm,
  };
};
