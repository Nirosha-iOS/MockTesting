import type { ReactNode } from "react";
import { Link, NavLink, type LinkProps } from "react-router-dom";

export function SidebarNavLink({
  to,
  end,
  icon,
  children,
  onClick,
}: {
  to: string;
  end?: boolean;
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? "crm-nav-link active" : "crm-nav-link")}
      onClick={onClick}
    >
      <span className="crm-nav-icon">{icon}</span>
      <span className="crm-nav-label">{children}</span>
    </NavLink>
  );
}

export function ConfigNavLink({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? "crm-config-nav-link is-active" : "crm-config-nav-link")}
    >
      {children}
    </NavLink>
  );
}

export function InlineLink({ className = "", ...props }: LinkProps) {
  return <Link className={["crm-link-strong", className].filter(Boolean).join(" ")} {...props} />;
}
