import { useId, type SelectHTMLAttributes } from "react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  fullWidth?: boolean;
};

/**
 * Native select styled with design tokens (use for dropdowns until a custom menu is required).
 */
export function Select({ label, fullWidth, className = "", id: idProp, children, ...rest }: SelectProps) {
  const uid = useId();
  const id = idProp ?? uid;
  const select = (
    <select
      id={id}
      className={["input", "crm-select", fullWidth ? "crm-select--full" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </select>
  );

  if (label) {
    return (
      <label className="crm-inline-field" htmlFor={id}>
        {label}
        {select}
      </label>
    );
  }

  return select;
}
