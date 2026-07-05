"use client";

type FilePickerButtonProps = {
  label: string;
  onSelect: (files: FileList) => void;
  disabled?: boolean;
};

// A styled file picker: the native input is hidden and a <label> acts as the
// button, so it matches the rest of the UI instead of the browser default.
export default function FilePickerButton({
  label,
  onSelect,
  disabled = false,
}: FilePickerButtonProps) {
  return (
    <label
      className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-gray-50"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="h-4 w-4"
      >
        <path d="M10 3a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 10 3Z" />
      </svg>
      {label}
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onSelect(e.target.files);
          }
          e.target.value = ""; // allow re-selecting the same file
        }}
        className="hidden"
      />
    </label>
  );
}
