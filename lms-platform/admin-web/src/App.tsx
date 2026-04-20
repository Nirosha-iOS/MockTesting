import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { BulkLeadUploadPage } from "./features/configuration/BulkLeadUploadPage";
import { AttendanceConfigPage } from "./features/configuration/AttendanceConfigPage";
import { ConfigurationHomePage } from "./features/configuration/ConfigurationHomePage";
import { ConfigurationLayout } from "./features/configuration/ConfigurationLayout";
import { EmployeesPage } from "./features/configuration/EmployeesPage";
import { LeadFormRulesPage } from "./features/configuration/LeadFormRulesPage";
import { LinksModulePage } from "./features/configuration/LinksModulePage";
import { MappingModulePage } from "./features/configuration/MappingModulePage";
import { MasterModulePage } from "./features/configuration/MasterModulePage";
import { ProductDocumentsPage } from "./features/configuration/ProductDocumentsPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { LeadDetailPage } from "./features/leads/LeadDetailPage";
import { LeadsPage } from "./features/leads/LeadsPage";
import { ReportsPage } from "./features/reports/ReportsPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { AppShell } from "./layout/AppShell";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:leadId" element={<LeadDetailPage />} />
            <Route
              path="reports"
              element={<ReportsPage />}
            />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="configuration" element={<ConfigurationLayout />}>
              <Route index element={<ConfigurationHomePage />} />
              <Route path="lead-form" element={<LeadFormRulesPage />} />
              <Route
                path="employees"
                element={<EmployeesPage />}
              />
              <Route
                path="products"
                element={
                  <MasterModulePage
                    title="Add product"
                    subtitle="Product catalog and SKU metadata shared with leads, quotes, and mobile offline catalogs."
                    path="/api/v1/config/products"
                  />
                }
              />
              <Route
                path="verticals"
                element={<MasterModulePage title="Add vertical" subtitle="Industry verticals for segmentation, routing rules, and reporting." path="/api/v1/config/verticals" />}
              />
              <Route
                path="roles"
                element={<MasterModulePage title="Add role" subtitle="Named roles for RBAC across admin and mobile." path="/api/v1/config/roles" />}
              />
              <Route
                path="functions"
                element={<MasterModulePage title="Add function" subtitle="Fine-grained permissions (functions) attached to roles." path="/api/v1/config/functions" />}
              />
              <Route
                path="vertical-role-mapping"
                element={
                  <MappingModulePage
                    title="Vertical ↔ role mapping"
                    subtitle="Which roles apply in which verticals for assignment and data scope."
                    mappingPath="/api/v1/config/vertical-role-mappings"
                    leftMasterPath="/api/v1/config/verticals"
                    leftLabel="Vertical"
                    leftKey="verticalId"
                    rightMasterPath="/api/v1/config/roles"
                    rightLabel="Role"
                    rightKey="roleId"
                  />
                }
              />
              <Route
                path="role-function-mapping"
                element={
                  <MappingModulePage
                    title="Role ↔ function mapping"
                    subtitle="Grant or revoke functions per role; enforced on API and mobile."
                    mappingPath="/api/v1/config/role-function-mappings"
                    leftMasterPath="/api/v1/config/roles"
                    leftLabel="Role"
                    leftKey="roleId"
                    rightMasterPath="/api/v1/config/functions"
                    rightLabel="Function"
                    rightKey="functionId"
                  />
                }
              />
              <Route path="product-documents" element={<ProductDocumentsPage />} />
              <Route
                path="bulk-upload"
                element={<BulkLeadUploadPage />}
              />
              <Route path="links" element={<LinksModulePage />} />
              <Route path="attendance" element={<AttendanceConfigPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
