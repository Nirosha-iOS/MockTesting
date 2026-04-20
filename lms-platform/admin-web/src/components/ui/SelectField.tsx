import { useId, type SelectHTMLAttributes, type ReactNode } from "react";

export type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  label: string;
  id?: string;
  error?: string;
  children: ReactNode;
};

/** Native `<select>` with stacked label (modal / form layouts). */
export function SelectField({ label, id: idProp, error, required, className = "", children, ...rest }: SelectFieldProps) {
  const uid = useId();
  const id = idProp ?? uid;
  return (
    <div className="crm-form-field">
      <label className="crm-form-field__label" htmlFor={id}>
        <span className="crm-form-field__label-text">{label}</span>
        {required ? (
          <span className="crm-form-field__required" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div className="crm-form-field__control">
        <select
          id={id}
          className={["input", "crm-select", "crm-select--full", className].filter(Boolean).join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          required={required}
          {...rest}
        >
          {children}
        </select>
      </div>
      {error ? (
        <p id={`${id}-err`} className="crm-form-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
