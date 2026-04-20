import type { HTMLAttributes } from "react";

export type CardTone = "default" | "panel" | "table" | "configPanel" | "configNav";

const TONE_CLASS: Record<CardTone, string> = {
  default: "card",
  panel: "card crm-panel",
  table: "card crm-table-card",
  configPanel: "card crm-config-panel",
  configNav: "crm-config-nav card",
};

export type CardProps = {
  as?: "section" | "div" | "nav" | "article";
  tone?: CardTone;
  className?: string;
  children?: React.ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "as">;

export function Card({ as: Tag = "section", tone = "default", className = "", children, ...rest }: CardProps) {
  return (
    <Tag className={[TONE_CLASS[tone], className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
