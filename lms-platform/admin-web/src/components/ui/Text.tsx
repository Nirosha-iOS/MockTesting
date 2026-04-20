import type { HTMLAttributes, ReactNode } from "react";

const VARIANT_CLASS = {
  eyebrow: "crm-eyebrow",
  pageTitle: "crm-page-title",
  subtitle: "crm-page-subtitle",
  muted: "crm-settings-muted",
  sidebarTitle: "crm-sidebar-title",
  sidebarSub: "crm-sidebar-sub",
  configNavTitle: "crm-config-nav-title",
  sectionHeading: "crm-section-heading",
  panelHeader: "crm-config-panel-heading",
  panelHeaderLead: "crm-config-panel-lead",
  footnote: "crm-sidebar-footnote",
} as const;

export type TextVariant = keyof typeof VARIANT_CLASS | "none";

export type TextProps = {
  as?: "p" | "h1" | "h2" | "h3" | "div" | "span";
  variant?: TextVariant;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "as">;

export function Text({ as: Tag = "p", variant = "none", className = "", children, ...rest }: TextProps) {
  const v = variant === "none" ? "" : VARIANT_CLASS[variant];
  return (
    <Tag className={[v, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
