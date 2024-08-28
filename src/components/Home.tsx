"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { IField, FieldType, IFieldSchema } from "@/interface/interface";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User as SupabaseUser } from "@supabase/supabase-js";
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

  const handleUpdateField = (id: string, key: keyof IField, value: string) => {
    dispatch(updateField({ id, key, value }));
  };

  const handleUpdateFieldOptions = (id: string, options: string[]) => {
    dispatch(updateFieldOptions({ id, options }));
  };

  const user = useSelector((state: RootState) => state?.userInfo?.user);

  const generateSchema = async () => {
    const schemaMap = new Map<string, IFieldSchema>();
    const schema: Record<string, IFieldSchema> = {};

    console.log(fields);

    // Iterate over the fields array in the original order
    fields.forEach((field) => {
      schema[field.id] = {
        type: field.type,
        question: field.question,
        description: field.description,
        options: field.options,
      };
    });
    const f = {
      name: "Customer Feedback Form",
      description: "A form to collect feedback from customers",
      fieldInfo: fields,
    };

    await insertForm(f);

    return schema;
  };

  async function insertForm(formData: any) {
    const { data, error } = await supabase.from("userform").insert([
      {
        form_title: formData.name,
        form_description: formData.description,
        form_data: formData?.fieldInfo,
        user_id: user?.id,
      },
    ]);

    if (error) {
      console.error("Error inserting form:", error);
      return;
    }
  }

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
            <DropdownMenuBox id={field?.id} index={index} />
            <Label htmlFor="question">Question {index + 1}</Label>
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
                        handleUpdateFieldOptions(field.id, newOptions);
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
                          handleUpdateFieldOptions(field.id, newOptions);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button
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
                </Button>
              </>
            )}
            <div className="space-x-2">
              <Button onClick={() => handleCopyField(field.id)}>
                Copy Field
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteField(field.id)}
              >
                Delete Field
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-x-2">
        {/* <Button onClick={() => handleAddField("text")}>Add Text Field</Button>
        <Button onClick={() => handleAddField("number")}>
          Add Number Field
        </Button>
        <Button onClick={() => handleAddField("url")}>Add URL Field</Button>
        <Button onClick={() => handleAddField("phone")}>Add Phone Field</Button>
        <Button onClick={() => handleAddField("single-select")}>
          Add Single Select Field
        </Button>
        <Button onClick={() => handleAddField("multi-select")}>
          Add Multi Select Field
        </Button> */}
        <PopOver />
      </div>
      <div className="space-x-2">
        <Button onClick={generateSchema}>Generate Schema</Button>
      </div>
    </div>
  );
};

export default DynamicForm;
