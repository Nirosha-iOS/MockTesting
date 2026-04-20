import { PageHeader } from "../../components/ui/PageHeader";

export function ModulePlaceholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="crm-page crm-page--dense">
      <PageHeader variant="dense" eyebrow="Roadmap" title={title} subtitle={subtitle} />
      <div className="card crm-panel">
        <p>This module is scaffolded for the roadmap. Navigation and RBAC hooks are already in place at the shell level.</p>
      </div>
    </div>
  );
}
