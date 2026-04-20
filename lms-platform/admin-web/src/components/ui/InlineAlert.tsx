import type { HTMLAttributes, ReactNode } from "react";

export function InlineAlert({ className = "", children, ...rest }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["crm-inline-alert", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
