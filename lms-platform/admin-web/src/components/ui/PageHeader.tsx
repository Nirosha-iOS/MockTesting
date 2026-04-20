import type { ReactNode } from "react";
import { Text } from "./Text";

export type PageHeaderVariant = "default" | "dense";

export function PageHeader({
  variant = "default",
  className = "",
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  variant?: PageHeaderVariant;
  className?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  if (variant === "dense") {
    return (
      <div className={["crm-page-toolbar", "card", className].filter(Boolean).join(" ")}>
        <div className="crm-page-toolbar__left">
          {eyebrow ? <span className="crm-page-toolbar__eyebrow">{eyebrow}</span> : null}
          <h1 className="crm-page-title">{title}</h1>
          {subtitle ? (
            <p className="crm-page-toolbar__hint" title={subtitle}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? <div className="crm-page-toolbar__controls">{actions}</div> : null}
      </div>
    );
  }

  return (
    <div className={["crm-page-header", className].filter(Boolean).join(" ")}>
      <div>
        {eyebrow ? (
          <Text as="p" variant="eyebrow">
            {eyebrow}
          </Text>
        ) : null}
        <Text as="h1" variant="pageTitle">
          {title}
        </Text>
        {subtitle ? (
          <Text as="p" variant="subtitle">
            {subtitle}
          </Text>
        ) : null}
      </div>
      {actions ? <div className="crm-page-actions">{actions}</div> : null}
    </div>
  );
}
