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
const supabase = createClient();

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fields = useSelector((state: RootState) => state?.fields?.fields);

  const handleAddField = (type: FieldType) => {
    dispatch(addField(type));
  };

  const handleCopyField = (id: string) => {
    dispatch(copyField(id));
  };

  const handleDeleteField = (id: string) => {
    dispatch(deleteField(id));
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

  const handleGenerateSchema = async () => {
    try {
      const formInfo = {
        name: "Customer Feedback Form",
        description: "A form to collect feedback from customers",
        fieldInfo: fields,
        formId: uuidv4(),
      };
      console.log(fields);
      const { error, formId } = await generateSchemaServer(formInfo, user);
      if (error) throw error;
      console.log(formId, "okk");
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

  // async function insertForm(formData: any) {
  //   const { data, error } = await supabase.from("userform").insert([
  //     {
  //       form_title: formData.name,
  //       form_description: formData.description,
  //       form_data: formData?.fieldInfo,
  //       user_id: user?.id,
  //     },
  //   ]);

  //   if (error) {
  //     console.error("Error inserting form:", error);
  //     return;
  //   }
  // }

  useEffect(() => {
    dispatch(fetchUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 w-full sm:w-[80%] sm:max-w-[600px]">
      <div className="flex flex-col gap-6">
        <p>{user?.email}</p>
        <div>
          <form action="/auth/signout" method="post">
            <button className="button block" type="submit">
              Sign out
            </button>
          </form>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md space-y-2 ">
            <div className="flex w-full justify-between items-center">
              <Label htmlFor="question">Question {index + 1}</Label>
              <DropdownMenuBox id={field?.id} index={index} />
            </div>
            <Input
              placeholder="Question"
              value={field.question}
              onChange={(e) =>
                handleUpdateField(field.id, "question", e.target.value)
              }
              className="w-full"
            />
            {(field.type === "text" || field.type === "url") && (
              <>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  placeholder="Description"
                  value={field.description}
                  onChange={(e) =>
                    handleUpdateField(field.id, "description", e.target.value)
                  }
                  className="w-full"
                />
                <Label htmlFor="answer">Answer</Label>
                <Input
                  placeholder="Enter text or url"
                  disabled={true}
                  className="w-full"
                />
              </>
            )}

            {field.type === "large-text" && (
              <>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  placeholder="Description"
                  value={field.description}
                  onChange={(e) =>
                    handleUpdateField(field.id, "description", e.target.value)
                  }
                  className="w-full"
                />
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  placeholder="Enter large text"
                  disabled={true}
                  className="w-full"
                />
              </>
            )}
            {field.type === "number" && (
              <>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  placeholder="Description"
                  value={field.description}
                  onChange={(e) =>
                    handleUpdateField(field.id, "description", e.target.value)
                  }
                  className="w-full"
                />
                <Label htmlFor="answer">Answer</Label>
                <Input
                  placeholder="Enter number"
                  disabled={true}
                  type="number"
                  className="w-full"
                />
              </>
            )}
            {field.type === "multiple-choice-grid" && (
              <>
                <Label htmlFor="rows">Rows</Label>
                {field.rows?.map((row, index) => (
                  <div key={index} className="flex flex-row gap-4">
                    <Input
                      placeholder={`Row ${index + 1}`}
                      value={row}
                      onChange={(e) => {
                        const newRows = [...field.rows!];
                        newRows[index] = e.target.value;
                        handleUpdateFieldOptions("row", {
                          ...field,
                          rows: newRows,
                        });
                      }}
                      className="w-full"
                    />
                    {field?.rows && field?.rows?.length > 1 && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const newRows = field.rows!.filter(
                            (_, i) => i !== index
                          );
                          handleUpdateFieldOptions("row", {
                            ...field,
                            rows: newRows,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const newRows = [...(field.rows || []), ""];
                    handleUpdateFieldOptions("row", {
                      ...field,
                      rows: newRows,
                    });
                  }}
                >
                  Add Row
                </Button>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="columns">Columns</Label>
                  {field.columns?.map((column, index) => (
                    <div key={index} className="flex flex-row gap-4">
                      <Input
                        placeholder={`Column ${index + 1}`}
                        value={column}
                        onChange={(e) => {
                          const newColumns = [...field.columns!];
                          newColumns[index] = e.target.value;
                          handleUpdateFieldOptions("column", {
                            ...field,
                            columns: newColumns,
                          });
                        }}
                        className="w-full"
                      />
                      {field?.columns && field.columns.length > 1 && (
                        <Button
                          variant="destructive"
                          onClick={() => {
                            const newColumns = field.columns!.filter(
                              (_, i) => i !== index
                            );
                            handleUpdateFieldOptions("column", {
                              ...field,
                              columns: newColumns,
                            });
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    const newColumns = [...(field.columns || []), ""];
                    handleUpdateFieldOptions("column", {
                      ...field,
                      columns: newColumns,
                    });
                  }}
                >
                  Add Column
                </Button>
              </>
            )}

            {(field.type === "single-select" ||
              field.type === "multi-select") && (
              <>
                <Label htmlFor="option">Options *</Label>
                {field.options!.map((option, index) => (
                  <div key={index} className="flex flex-row gap-4">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...field.options!];
                        newOptions[index] = e.target.value;
                        handleUpdateFieldOptions("options", {
                          ...field,
                          options: newOptions,
                        });
                        // handleUpdateFieldOptions(field.id, newOptions);
                      }}
                      className="w-full"
                    />
                    {field.options!.length > 2 && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const newOptions = field.options!.filter(
                            (_, i) => i !== index
                          );
                          handleUpdateFieldOptions(
                            // field.id, field?.type,
                            "options",
                            {
                              ...field,
                              options: newOptions,
                            }
                          );
                          // handleUpdateFieldOptions(field.id, newOptions);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                {/* <Button
                  onClick={() =>
                    handleUpdateFieldOptions(field.id, [
                      ...field.options!,
                      field?.options?.length
                        ? `Option ${field?.options?.length + 1}`
                        : "",
                    ])
                  }
                >
                  Add Option
                </Button> */}
              </>
            )}
            <div className="pt-4 flex flex-row space-x-2 ">
              <>
                {(field.type === "single-select" ||
                  field.type === "multi-select") && (
                  <Button
                    // onClick={() =>
                    //   handleUpdateFieldOptions(field.id, [
                    //     ...field.options!,
                    //     field?.options?.length
                    //       ? `Option ${field?.options?.length + 1}`
                    //       : "",
                    //   ])
                    // }
                    onClick={
                      () =>
                        handleUpdateFieldOptions(
                          // field.id,
                          // field?.type,
                          "options",
                          {
                            ...field,
                            options: [
                              ...field.options!,
                              field?.options?.length
                                ? `Option ${field?.options?.length + 1}`
                                : "",
                            ],
                          }
                        ) // Pass an object
                    }
                    className=" h-[32px] p-[8px]"
                  >
                    Add Option
                  </Button>
                )}
              </>
              <div className="flex items-center space-x-2">
                <Switch
                  className="relative inline-flex items-center"
                  onCheckedChange={(checked) =>
                    handleUpdateField(field.id, "isRequired", checked)
                  }
                  id="is-required"
                />
                <Label htmlFor="is-required">Required</Label>
              </div>

              <Button
                className="w-[32px] h-[32px] p-[2px]"
                onClick={() => handleCopyField(field.id)}
              >
                <Copy size={16} strokeWidth={1} />
              </Button>
              <Button
                variant="destructive"
                className="w-[32px] h-[32px] p-[2px]"
                onClick={() => handleDeleteField(field.id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-x-2">
        <PopOver />
      </div>
      <div className="space-x-2">
        <Button onClick={handleGenerateSchema}>Generate Schema</Button>
      </div>
    </div>
  );
};

export default DynamicForm;
