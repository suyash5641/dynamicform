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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useParams } from "next/navigation";
const supabase = createClient();

interface IFormWrapper {
  formNewId: string;
  isEdit?: boolean;
  isSubmit?: boolean;
}

const DynamicForm = ({
  formNewId,
  isEdit = true,
  isSubmit = false,
}: IFormWrapper) => {
  const dispatch = useDispatch<AppDispatch>();
  const fields = useSelector((state: RootState) => state?.fields?.fields);
  // const { formNewId } = useParams() as { formNewId: string };
  // console.log({ formNewId });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const {
    handleCopyField,
    handleGenerateSchema,
    handleUpdateFieldOptions,
    handleUpdateField,
    handleDeleteField,
    handleDragAndDrop,
  } = useCreateForm();

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedFields = [...fields];
    const [draggedField] = updatedFields.splice(draggedIndex, 1);
    updatedFields.splice(index, 0, draggedField);

    setDraggedIndex(index);
    console.log(updatedFields, "ok");
    handleDragAndDrop(updatedFields);
    // setFields(updatedFields);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const user = useSelector((state: RootState) => state?.userInfo?.user);

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
        {fields?.map((field, index) => (
          <div key={field?.id} className="p-4 border rounded-md space-y-2">
            <div className="flex w-full justify-between items-center">
              <Label htmlFor="question">Question {index + 1}</Label>
              {isEdit && <DropdownMenuBox id={field?.id} index={index} />}
            </div>
            <Input
              placeholder="Question"
              value={field?.question}
              disabled={isEdit ? false : true}
              onChange={(e) =>
                handleUpdateField(field?.id, "question", e.target.value)
              }
              className="w-full"
            />
            {(field?.type === "text" || field?.type === "url") && (
              <>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  placeholder="Description"
                  value={field?.description}
                  disabled={isEdit ? false : true}
                  onChange={(e) =>
                    handleUpdateField(field?.id, "description", e.target.value)
                  }
                  className="w-full"
                />
                <Label htmlFor="answer">Answer</Label>
                <Input
                  placeholder="Enter text or url"
                  disabled={isEdit ? true : true}
                  value={field?.answer}
                  className="w-full"
                />
              </>
            )}

            {field.type === "large-text" && (
              <>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  placeholder="Description"
                  disabled={isEdit ? false : true}
                  value={field.description}
                  onChange={(e) =>
                    handleUpdateField(field.id, "description", e.target.value)
                  }
                  className="w-full"
                />
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  placeholder="Enter large text"
                  disabled={!isEdit ? false : true}
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
                  disabled={isEdit ? false : true}
                  onChange={(e) =>
                    handleUpdateField(field.id, "description", e.target.value)
                  }
                  className="w-full"
                />
                <Label htmlFor="answer">Answer</Label>
                <Input
                  placeholder="Enter number"
                  disabled={!isEdit ? false : true}
                  type="number"
                  className="w-full"
                />
              </>
            )}
            {field.type === "multiple-choice-grid" &&
              (isEdit ? (
                <>
                  <Label htmlFor="rows">Rows</Label>
                  {field.rows?.map((row, index) => (
                    <div key={index} className="flex flex-row gap-4">
                      <Input
                        placeholder={`Row ${index + 1}`}
                        value={row}
                        disabled={isEdit ? false : true}
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
                      {isEdit && field?.rows && field?.rows?.length > 1 && (
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
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEdit && (
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
                  )}
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="columns">Columns</Label>
                    {field.columns?.map((column, index) => (
                      <div key={index} className="flex flex-row gap-4">
                        <Input
                          placeholder={`Column ${index + 1}`}
                          value={column}
                          disabled={isEdit ? false : true}
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
                        {isEdit &&
                          field?.columns &&
                          field.columns.length > 1 && (
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
                              <Trash size={16} />
                            </Button>
                          )}
                      </div>
                    ))}
                  </div>
                  {isEdit && (
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
                  )}
                </>
              ) : (
                <div className="grid-view">
                  <div className="flex flex-row">
                    <div className="break-all text-center w-40"></div>{" "}
                    {field.columns?.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="w-40 text-center font-bold"
                      >
                        {column}
                      </div>
                    ))}
                  </div>

                  {field.rows?.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-row gap-2 mb-2">
                      <Label className="break-all text-center w-40">
                        {row}
                      </Label>
                      {field.columns?.map((column, colIndex) => (
                        <div
                          key={colIndex}
                          className="flex justify-center items-center w-20"
                        >
                          <Checkbox
                            id={`row-${rowIndex}-column-${colIndex}`}
                            // checked={field.selectedColumns?.[rowIndex]?.includes(column) || false}
                            // onChange={() => handleCheckboxChange(rowIndex, column)}
                            disabled={!isEdit}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}

            {(field.type === "single-select" ||
              field.type === "multi-select") && (
              <>
                <Label htmlFor="option">Options *</Label>
                {!isEdit && field.type === "single-select" && (
                  <RadioGroup
                    defaultValue={
                      field?.answer?.length ? field?.answer : field.options![0]
                    }
                    className="space-y-2"
                    disabled={isSubmit}
                    onValueChange={(value: string) => {
                      if (!isSubmit) {
                        console.log("bfr", value);
                        handleUpdateFieldOptions("answer", {
                          ...field,
                          answer: value,
                        });
                      }
                    }}
                  >
                    {field.options!.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`option-${index}`}
                          disabled={isSubmit}
                        />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {isEdit &&
                  field.options!.map((option, index) => (
                    <div key={index} className="flex flex-row gap-4">
                      <>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          disabled={isEdit ? false : true}
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
                            <Trash size={16} />
                          </Button>
                        )}
                      </>

                      {/* <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      disabled={isEdit ? false : true}
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
                    /> */}
                      {/* {isEdit && field.options!.length > 2 && (
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
                        <Trash size={16} />
                      </Button>
                    )} */}
                    </div>
                  ))}
              </>
            )}

            {isEdit && (
              <div className="pt-4 flex flex-row space-x-2 ">
                <>
                  {(field.type === "single-select" ||
                    field.type === "multi-select") && (
                    <Button
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
                                // field?.options?.length
                                //   ? ``
                                //   : "",
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
                {
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
                }

                {
                  <Button
                    className="w-[32px] h-[32px] p-[2px]"
                    onClick={() => handleCopyField(field.id)}
                  >
                    <Copy size={16} strokeWidth={1} />
                  </Button>
                }
                {
                  <Button
                    variant="destructive"
                    className="w-[32px] h-[32px] p-[2px]"
                    onClick={() => handleDeleteField(field.id)}
                  >
                    <Trash size={16} />
                  </Button>
                }
              </div>
            )}
          </div>
        ))}
      </div>
      {isEdit && (
        <div className="space-x-2">
          <PopOver />
        </div>
      )}
      <div className="space-x-2">
        <Button onClick={() => handleGenerateSchema(formNewId)}>
          Preview Form
        </Button>
      </div>
    </div>
  );
};

export default DynamicForm;
