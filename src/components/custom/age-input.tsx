import React, { useEffect, useState } from "react";

interface AgeInputProps {
  label: string;
  value: number | undefined; // value always in years (fractional OK)
  onChange: (years: number) => void;
}

const AgeInput: React.FC<AgeInputProps> = ({ label, value, onChange }) => {
  const [unit, setUnit] = useState<"years" | "months">("years");

  // Derive display value based on current unit
  const displayValue =
    value !== undefined
      ? unit === "months"
        ? Math.round(value * 12) // round months to whole numbers
        : Math.round(value * 100) / 100 // 2 decimal places for years
      : "";

  // Keep raw input in sync with value prop
  const [rawInput, setRawInput] = useState<string>(
    displayValue ? String(displayValue) : ""
  );

  // Sync rawInput when value or unit changes externally
  useEffect(() => {
    setRawInput(displayValue ? String(displayValue) : "");
  }, [value, unit]);

  const handleInputChange = (input: string) => {
    setRawInput(input);

    if (input === "" || isNaN(Number(input))) {
      return; // don't call onChange with invalid input
    }

    const num = Number(input);
    if (num < 0) return;

    const maxYears = 150;
    const maxMonths = maxYears * 12;

    if (unit === "years" && num > maxYears) return;
    if (unit === "months" && num > maxMonths) return;

    const years = unit === "months" ? num / 12 : num;
    onChange(years);
  };

  const handleUnitChange = (newUnit: "years" | "months") => {
    setUnit(newUnit);
    if (value !== undefined) {
      const years = newUnit === "months" ? value * 12 : value;
      const rounded =
        newUnit === "months"
          ? Math.round(years)
          : Math.round(years * 100) / 100;
      onChange(newUnit === "months" ? rounded / 12 : rounded);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="flex">
        <input
          type="number"
          min="0"
          step={unit === "years" ? "0.01" : "1"}
          value={rawInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={unit === "years" ? "e.g. 2.5" : "e.g. 30"}
          className="w-full min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <select
          value={unit}
          onChange={(e) =>
            handleUnitChange(e.target.value as "years" | "months")
          }
          className="w-28 rounded-r-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="years">Years</option>
          <option value="months">Months</option>
        </select>
      </div>

      {/* Optional helper text */}
      {value !== undefined && (
        <p className="text-xs text-slate-500">
          {unit === "years"
            ? `${(value * 12).toFixed(0)} months old`
            : `${value.toFixed(2)} years old`}
        </p>
      )}
    </div>
  );
};

export default AgeInput;
