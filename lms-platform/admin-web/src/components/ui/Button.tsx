import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "ghost" | "primaryCompact";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  ghost: "crm-ghost-button",
  primaryCompact: "btn-primary btn-primary--compact",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  const v = VARIANT_CLASS[variant];
  return <button type={type} className={[v, className].filter(Boolean).join(" ")} {...props} />;
}
