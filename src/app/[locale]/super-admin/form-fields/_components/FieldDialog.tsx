import { useEffect, useState } from "react";
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

type FieldType = "text" | "number" | "date" | "select" | "file";
type Field = {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  section?: string;
};

type FieldDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (field: Omit<Field, "id">) => void;
  initialField?: Omit<Field, "id"> | null;
};

export default function FieldDialog({
  open,
  onOpenChange,
  onSubmit,
  initialField,
}: FieldDialogProps) {
  const [form, setForm] = useState<Omit<Field, "id">>({
    label: "",
    name: "",
    type: "text",
    placeholder: "",
    required: false,
    options: [],
    section: "",
  });

  useEffect(() => {
    if (initialField) setForm(initialField);
    else
      setForm({
        label: "",
        name: "",
        type: "text",
        placeholder: "",
        required: false,
        options: [],
        section: "",
      });
  }, [initialField, open]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialField ? "Edit Field" : "Add Field"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-3"
        >
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
            <Button type="submit">{initialField ? "Save" : "Add"}</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
