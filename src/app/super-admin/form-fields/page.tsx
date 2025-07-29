"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormList from "@/app/super-admin/form-fields/_components/FormList";
import FieldTable from "@/app/super-admin/form-fields/_components/FieldTable";
import FieldDialog from "@/app/super-admin/form-fields/_components/FieldDialog";

type Form = {
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

const mockForms: Form[] = [
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
  const [selectedForm, setSelectedForm] = useState<Form>(mockForms[0]);
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

  // Handlers for modular components
  const handleEdit = (field: Field) => {
    setEditingField(field);
    setDialogOpen(true);
  };

  const handleDelete = (fieldId: string) => {
    setFields((prev) => ({
      ...prev,
      [selectedForm.id]: prev[selectedForm.id].filter((f) => f.id !== fieldId),
    }));
  };

  const handleDialogOpen = () => {
    setEditingField(null);
    setDialogOpen(true);
  };

  const handleDialogSubmit = (field: Omit<Field, "id">) => {
    if (editingField) {
      setFields((prev) => ({
        ...prev,
        [selectedForm.id]: prev[selectedForm.id].map((f) =>
          f.id === editingField.id ? { ...editingField, ...field } : f
        ),
      }));
    } else {
      setFields((prev) => ({
        ...prev,
        [selectedForm.id]: [
          ...prev[selectedForm.id],
          { ...field, id: Date.now().toString() },
        ],
      }));
    }
    setDialogOpen(false);
    setEditingField(null);
  };

  return (
    <SidebarLayout title="Form Field Settings">
      <div className="flex gap-4 mb-6">
        <div>
          <div className="font-semibold mb-2">Forms</div>
          <FormList
            forms={mockForms}
            selectedForm={selectedForm}
            onSelect={setSelectedForm}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-lg">
              {selectedForm.name} Fields
            </div>
            <Button
              onClick={handleDialogOpen}
          
            >
              + Add Field
            </Button>
          </div>
          <FieldTable
            fields={fields[selectedForm.id] || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <FieldDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingField(null);
        }}
        onSubmit={handleDialogSubmit}
        initialField={
          editingField ? (({ id, ...rest }) => rest)(editingField) : null
        }
      />
    </SidebarLayout>
  );
}
