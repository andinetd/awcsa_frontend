import { Button } from "@/components/ui/button";

type Form = { id: string; name: string };

type FormListProps = {
  forms: Form[];
  selectedForm: Form;
  onSelect: (form: Form) => void;
};

export default function FormList({
  forms,
  selectedForm,
  onSelect,
}: FormListProps) {
  return (
    <ul className="space-y-1">
      {forms.map((mod) => (
        <li key={mod.id}>
          <Button
            variant={selectedForm.id === mod.id ? "default" : "outline"}
            onClick={() => onSelect(mod)}
            className="w-full hover:cursor-pointer"
          >
            {mod.name}
          </Button>
        </li>
      ))}
    </ul>
  );
}
