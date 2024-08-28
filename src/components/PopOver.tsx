import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { FieldType } from "@/interface/interface";
import { addField } from "@/slice/formSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useState } from "react";

const PopOver = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  //   const fields = useSelector((state: RootState) => state?.fields?.fields);

  const handleAddField = (type: FieldType) => {
    setOpen((prev) => !prev);
    setTimeout(() => {
      dispatch(addField(type));
    }, 400);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={(prev) => setOpen(!prev)}>
          Add form field
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 flex flex-col gap-2">
        <Button
          variant="outline"
          className="max-w-[200px]"
          onClick={() => handleAddField("text")}
        >
          Text
        </Button>
        <Button
          variant="outline"
          className="max-w-[200px]"
          onClick={() => handleAddField("large-text")}
        >
          Large Text
        </Button>
        <Button
          variant="outline"
          className="max-w-[200px]"
          onClick={() => handleAddField("number")}
        >
          Number
        </Button>
        <Button
          variant="outline"
          className="max-w-[200px]"
          onClick={() => handleAddField("url")}
        >
          URL
        </Button>
        <Button
          variant="outline"
          className="max-w-[200px]"
          onClick={() => handleAddField("phone")}
        >
          Phone Number
        </Button>
        <Button
          variant="outline"
          className="max-w-[200px]"
          onClick={() => handleAddField("single-select")}
        >
          Single Select
        </Button>
        <Button
          variant="outline"
          className="max-w-[200px]"
          onClick={() => handleAddField("multi-select")}
        >
          Multi Select
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default PopOver;
