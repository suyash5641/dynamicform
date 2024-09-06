"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { IField, FieldType, IFieldSchema, Field } from "@/interface/interface";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Switch } from "@/components/ui/switch";
import {
  addField,
  copyField,
  deleteField,
  updateField,
  updateFieldOptions,
} from "@/slice/formSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import PopOver from "./PopOver";
import { DropdownMenuBox } from "./DropDown";
import { createClient } from "@/utils/supabase/client";
import { fetchUser } from "@/slice/userSlice";
import { generateSchemaServer } from "@/app/schemaActions";
import { toast } from "react-toastify";
import { Copy, Delete, DeleteIcon, Trash } from "lucide-react";
import { useCreateForm } from "@/hooks/useCreateForm";
import { redirect, useRouter } from "next/navigation";

const supabase = createClient();

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // const fields = useSelector((state: RootState) => state?.fields?.fields);

  // const {
  //   handleCopyField,
  //   handleGenerateSchema,
  //   handleUpdateFieldOptions,
  //   handleUpdateField,
  //   handleDeleteField,
  // } = useCreateForm();

  const user = useSelector((state: RootState) => state?.userInfo?.user);

  useEffect(() => {
    dispatch(fetchUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const f: IField[] = [
    {
      id: uuidv4(),
      type: "text", // Must be a valid FieldType value
      question: "",
      answer: "",
      isRequired: false,
      description: "",
      options: [],
      rows: [],
      columns: [],
    },
  ];

  const handleGenerateSchema = async () => {
    try {
      const formInfo = {
        name: "Customer Feedback Form",
        description: "A form to collect feedback from customers",
        fieldInfo: f,
        formId: uuidv4(),
      };
      console.log(formInfo, user);
      const { error, formId } = await generateSchemaServer(formInfo, user);
      if (error) throw error;
      console.log(formId, "bfr", formInfo);
      router.push(`/form/${formId}?isEdit=true&isSubmit=false`);
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

  return (
    <div className="space-y-4 w-full sm:w-[80%] sm:max-w-[600px]">
      <div className="space-x-2">
        <Button onClick={handleGenerateSchema}>Create Form</Button>
      </div>
    </div>
  );
};

export default Home;
