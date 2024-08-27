import { FieldType } from "@/interface/interface";
import { addField } from "@/slice/formSlice";
import { AppDispatch } from "@/store/store";
import { useState } from "react";
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
export const FormAdd = () => {
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
