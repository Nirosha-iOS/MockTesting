import type { HTMLAttributes, ReactNode } from "react";

export function BulletList({ className = "", children, ...rest }: { children: ReactNode } & HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={["crm-bullet-list", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </ul>
  );
}

export function ConfigNavList({ className = "", children, ...rest }: { children: ReactNode } & HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={["crm-config-nav-list", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </ul>
  );
}
