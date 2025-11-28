import React, { useState } from "react";

const AgeInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (convertedYears: number) => void;
}) => {
  const [rawValue, setRawValue] = React.useState<number>(value ? value : 1);
  const [unit, setUnit] = React.useState<"years" | "months">("years");

  const update = (val: number, u: "years" | "months") => {
    let converted = u === "months" ? val / 12 : val;
    onChange(converted);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="flex">
        <input
          type="number"
          min={1}
          value={rawValue}
          onChange={(e) => {
            const num = Number(e.target.value);
            setRawValue(num);
            update(num, unit);
          }}
          className="w-full min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-200 px-3 py-2.5 text-sm"
        />

        <select
          value={unit}
          onChange={(e) => {
            const u = e.target.value as "years" | "months";
            setUnit(u);
            update(rawValue, u);
          }}
          className="w-28 rounded-r-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm cursor-pointer"
        >
          <option value="years">Years</option>
          <option value="months">Months</option>
        </select>
      </div>
    </div>
  );
};

export default AgeInput;
