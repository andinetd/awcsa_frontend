"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil, Trash } from "lucide-react";

type Module = {
  id: string;
  name: string;
};

type FieldType = "text" | "number" | "date" | "select" | "file";

type Field = {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select
  section?: string;
};

const mockModules: Module[] = [
  { id: "users", name: "Users" },
  { id: "children", name: "Children Info" },
];

const initialFields: Record<string, Field[]> = {
  users: [
    {
      id: "1",
      label: "First Name",
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      id: "2",
      label: "Role",
      name: "role",
      type: "select",
      required: true,
      options: ["Admin", "User"],
    },
  ],
  children: [
    {
      id: "1",
      label: "Child Name",
      name: "childName",
      type: "text",
      required: true,
    },
    {
      id: "2",
      label: "Date of Birth",
      name: "dob",
      type: "date",
      required: true,
    },
  ],

};

export default function FormFieldsPage() {
  const [selectedModule, setSelectedModule] = useState<Module>(mockModules[0]);
  const [fields, setFields] = useState<Record<string, Field[]>>(initialFields);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  // Form state
  const [form, setForm] = useState<Omit<Field, "id">>({
    label: "",
    name: "",
    type: "text",
    placeholder: "",
    required: false,
    options: [],
    section: "",
  });

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setForm({ ...field, options: field.options || [] });
    setDialogOpen(true);
  };

  const handleDelete = (fieldId: string) => {
    setFields((prev) => ({
      ...prev,
      [selectedModule.id]: prev[selectedModule.id].filter(
        (f) => f.id !== fieldId
      ),
    }));
  };

  const handleDialogOpen = () => {
    setEditingField(null);
    setForm({
      label: "",
      name: "",
      type: "text",
      placeholder: "",
      required: false,
      options: [],
      section: "",
    });
    setDialogOpen(true);
  };


const handleFormChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  if (type === "checkbox" && "checked" in e.target) {
    setForm((prev) => ({
      ...prev,
      [name]: (e.target as HTMLInputElement).checked,
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleTypeChange = (value: FieldType) => {
    setForm((prev) => ({
      ...prev,
      type: value,
      options: value === "select" ? [""] : [],
    }));
  };

  const handleOptionsChange = (idx: number, value: string) => {
    setForm((prev) => {
      const options = [...(prev.options || [])];
      options[idx] = value;
      return { ...prev, options };
    });
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...(prev.options || []), ""],
    }));
  };

  const removeOption = (idx: number) => {
    setForm((prev) => {
      const options = [...(prev.options || [])];
      options.splice(idx, 1);
      return { ...prev, options };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingField) {
      // Edit
      setFields((prev) => ({
        ...prev,
        [selectedModule.id]: prev[selectedModule.id].map((f) =>
          f.id === editingField.id ? { ...editingField, ...form } : f
        ),
      }));
    } else {
      // Add
      setFields((prev) => ({
        ...prev,
        [selectedModule.id]: [
          ...prev[selectedModule.id],
          { ...form, id: Date.now().toString() },
        ],
      }));
    }
    setDialogOpen(false);
  };

  return (
    <SidebarLayout title="Form Field Settings">
      <div className="flex gap-4 mb-6">
        <div>
          <div className="font-semibold mb-2">Modules</div>
          <ul className="space-y-1">
            {mockModules.map((mod) => (
              <li key={mod.id}>
                <Button
                  variant={selectedModule.id === mod.id ? "default" : "outline"}
                  onClick={() => setSelectedModule(mod)}
                  className="w-full hover:cursor-pointer "
                >
                  {mod.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-lg">
              {selectedModule.name} Fields
            </div>
            <Button onClick={handleDialogOpen} className="bg-black hover:bg-gray-900 hover:cursor-pointer">+ Add Field</Button>
          </div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50 ">
                  Label
                </th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50 ">
                  Name
                </th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50 ">
                  Type
                </th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50 ">
                  Required
                </th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50 ">
                  Section
                </th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50 ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fields[selectedModule.id]?.map((field) => (
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
                  <td className="bg-white px-4 py-2 text-sm text-gray-800 text-center">
                    <Checkbox checked={field.required} disabled />
                  </td>
                  <td className="bg-white px-4 py-2 text-sm text-gray-800">
                    {field.section}
                  </td>
                  <td className="bg-white px-4 py-2 text-sm text-gray-800">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v.01M12 12v.01M12 18v.01"
                            />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(field)}>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(field.id)}
                        >
                          <Trash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {fields[selectedModule.id]?.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
                    No fields yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Dialog for Add/Edit Field */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingField ? "Edit Field" : "Add Field"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              name="label"
              placeholder="Field Label"
              value={form.label}
              onChange={handleFormChange}
              required
            />
            <Input
              name="name"
              placeholder="Field Name (key)"
              value={form.name}
              onChange={handleFormChange}
              required
            />
            <Select value={form.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <span>{form.type}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="file">File</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="placeholder"
              placeholder="Placeholder / Default"
              value={form.placeholder}
              onChange={handleFormChange}
            />
            <Input
              name="section"
              placeholder="Section / Grouping"
              value={form.section}
              onChange={handleFormChange}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.required}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, required: !!checked }))
                }
                id="required"
              />
              <label htmlFor="required" className="cursor-pointer">
                Required
              </label>
            </div>
            {form.type === "select" && (
              <div>
                <div className="mb-1 font-medium">Options</div>
                {form.options?.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 mb-1">
                    <Input
                      value={opt}
                      onChange={(e) => handleOptionsChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeOption(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={addOption}>
                  + Add Option
                </Button>
              </div>
            )}
            <DialogFooter>
              <Button type="submit">{editingField ? "Save" : "Add"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}
