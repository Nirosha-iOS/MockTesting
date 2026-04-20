import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonVariant = "toolbar" | "theme" | "menu";

const VARIANT_CLASS: Record<IconButtonVariant, string> = {
  toolbar: "crm-icon-button",
  theme: "crm-theme-toggle",
  menu: "crm-menu-button",
};

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  children: ReactNode;
};

export function IconButton({ variant = "toolbar", className = "", type = "button", children, ...props }: IconButtonProps) {
  const v = VARIANT_CLASS[variant];
  return (
    <button type={type} className={[v, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
}
