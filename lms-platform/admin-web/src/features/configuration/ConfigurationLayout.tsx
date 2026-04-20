import { Outlet } from "react-router-dom";
import { Card, ConfigNavLink, ConfigNavList, PageHeader, Text } from "../../components/ui";
import { CONFIG_NAV } from "./configNav";

export function ConfigurationLayout() {
  return (
    <div className="crm-page crm-config-page">
      <PageHeader
        eyebrow="Admin"
        title="Configuration"
        subtitle="Central place for org setup. Complete these modules in the web admin first; the mobile app will follow the same rules and master data."
      />

      <div className="crm-config-layout">
        <Card as="nav" tone="configNav" aria-label="Configuration sections">
          <Text as="p" variant="configNavTitle">
            Modules
          </Text>
          <ConfigNavList>
            {CONFIG_NAV.map((item) => (
              <li key={item.to}>
                <ConfigNavLink to={item.to} end={item.end}>
                  {item.label}
                </ConfigNavLink>
              </li>
            ))}
          </ConfigNavList>
        </Card>
        <div className="crm-config-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
