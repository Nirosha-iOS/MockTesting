import type { ChangeEvent } from "react";

export type FileUploadFieldProps = {
  id: string;
  label?: string;
  accept?: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
};

export function FileUploadField({ id, label, accept, disabled, onChange, "aria-label": ariaLabel }: FileUploadFieldProps) {
  return (
    <div className="crm-file-upload">
      {label ? (
        <label className="crm-file-upload__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="crm-file-upload__control">
        <input
          id={id}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={onChange}
          aria-label={ariaLabel}
          className="crm-file-upload__input"
        />
      </div>
    </div>
  );
}
