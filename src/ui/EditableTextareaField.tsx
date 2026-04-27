// src/ui/EditableTextareaField.tsx
"use client";

interface EditableTextareaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id: string;
  rows?: number;
}

export default function EditableTextareaField({ label, value, onChange, id, rows = 4 }: EditableTextareaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      />
    </div>
  );
}
