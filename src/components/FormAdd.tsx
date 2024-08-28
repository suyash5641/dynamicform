import { FieldType } from "@/interface/interface";
import { insertFieldAtPosition } from "@/slice/formSlice";
import { AppDispatch } from "@/store/store";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IProps {
  id: string;
  insertBelow: boolean;
  index: number;
}

export const FormAdd = ({ id, insertBelow, index }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddField = useCallback(
    (type: FieldType) => {
      dispatch(insertFieldAtPosition({ type, index, insertBelow }));
    },
    [dispatch, index, insertBelow]
  );

  return (
    <div className="w-40 flex flex-col gap-2">
      <DropdownMenuItem
        className="max-w-[200px]"
        onClick={() => handleAddField("text")}
      >
        Text
      </DropdownMenuItem>
      <DropdownMenuItem
        className="max-w-[200px]"
        onClick={() => handleAddField("large-text")}
      >
        Large Text
      </DropdownMenuItem>
      <DropdownMenuItem
        className="max-w-[200px]"
        onClick={() => handleAddField("number")}
      >
        Number
      </DropdownMenuItem>
      <DropdownMenuItem
        className="max-w-[200px]"
        onClick={() => handleAddField("url")}
      >
        URL
      </DropdownMenuItem>
      <DropdownMenuItem
        className="max-w-[200px]"
        onClick={() => handleAddField("phone")}
      >
        Phone Number
      </DropdownMenuItem>
      <DropdownMenuItem
        className="max-w-[200px]"
        onClick={() => handleAddField("single-select")}
      >
        Single Select
      </DropdownMenuItem>
      <DropdownMenuItem
        className="max-w-[200px]"
        onClick={() => handleAddField("multi-select")}
      >
        Multi Select
      </DropdownMenuItem>
    </div>
  );
};
