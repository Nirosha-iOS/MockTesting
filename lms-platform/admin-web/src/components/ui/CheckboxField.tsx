import { useId, type InputHTMLAttributes } from "react";

export type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  label: string;
  id?: string;
};

export function CheckboxField({ label, id: idProp, className = "", ...rest }: CheckboxFieldProps) {
  const uid = useId();
  const id = idProp ?? uid;
  return (
    <div className="crm-form-field crm-form-field--checkbox">
      <label className="crm-checkbox-line" htmlFor={id}>
        <input id={id} type="checkbox" className={className} {...rest} />
        <span className="crm-checkbox-line__text">{label}</span>
      </label>
    </div>
  );
}
