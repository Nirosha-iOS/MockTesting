import { PageHeader } from "../../components/ui/PageHeader";

export function ConfigModulePlaceholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="crm-page crm-page--dense">
      <PageHeader variant="dense" eyebrow="Configuration" title={title} subtitle={subtitle} />
      <div className="card crm-panel">
        <p>
          This module is scaffolded for the admin-first rollout. Settings you define here will back the mobile app once those APIs and
          sync flows are wired.
        </p>
      </div>
    </div>
  );
}
