import { useId, type InputHTMLAttributes } from "react";

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  id?: string;
  error?: string;
  /** Use in compact toolbars: label stays for screen readers only. */
  hideLabel?: boolean;
};

/** Single-line input with visible label and optional validation message. */
export function TextField({ label, id: idProp, error, required, hideLabel, className = "", ...rest }: TextFieldProps) {
  const uid = useId();
  const id = idProp ?? uid;
  return (
    <div className={["crm-form-field", hideLabel ? "crm-form-field--hide-label" : ""].filter(Boolean).join(" ")}>
      <label className={hideLabel ? "crm-sr-only" : "crm-form-field__label"} htmlFor={id}>
        <span className="crm-form-field__label-text">{label}</span>
        {required ? (
          <span className="crm-form-field__required" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div className="crm-form-field__control">
        <input
          id={id}
          className={["input", className].filter(Boolean).join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          required={required}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${id}-err`} className="crm-form-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
