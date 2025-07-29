import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash } from "lucide-react";

type FieldType = "text" | "number" | "date" | "select" | "file";
type Field = {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  required: boolean;
  section?: string;
};

type FieldTableProps = {
  fields: Field[];
  onEdit: (field: Field) => void;
  onDelete: (fieldId: string) => void;
};

export default function FieldTable({
  fields,
  onEdit,
  onDelete,
}: FieldTableProps) {
  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50">
            Label
          </th>
          <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50">
            Name
          </th>
          <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50">
            Type
          </th>
          <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50">
            Required
          </th>
          <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50">
            Section
          </th>
          <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <tr key={field.id} className="rounded-md shadow-sm">
            <td className="bg-white px-4 py-2 text-sm text-gray-800">
              {field.label}
            </td>
            <td className="bg-white px-4 py-2 text-sm text-gray-800">
              {field.name}
            </td>
            <td className="bg-white px-4 py-2 text-sm text-gray-800">
              {field.type}
            </td>
            <td className="bg-white px-4 py-2 text-sm text-gray-800">
              <Checkbox checked={field.required} disabled />
            </td>
            <td className="bg-white px-4 py-2 text-sm text-gray-800">
              {field.section}
            </td>
            <td className="bg-white px-4 py-2 text-sm text-gray-800">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisIcon
                    className="h-4 w-4  cursor-pointer"
                    aria-label="Open user actions menu"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(field)}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(field.id)}>
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
        {fields.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center py-4 text-gray-400">
              No fields yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
