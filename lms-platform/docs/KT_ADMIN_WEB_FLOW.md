# LMS Admin Web — KT Flow Document

This KT document explains the current **admin-web** application flow end-to-end so a new developer can understand how users move through the app, where data comes from, and where to extend safely.

---

## 1) Project overview

- Product root: `lms-platform/`
- Web app: `lms-platform/admin-web/` (React + TypeScript + Vite)
- Shared tokens: `lms-platform/packages/design-tokens/`
- API target: Spring Boot backend endpoints under `/api/v1/*`
- Main app entrypoints:
  - `admin-web/src/main.tsx`
  - `admin-web/src/App.tsx`
  - `admin-web/src/layout/AppShell.tsx`

The web app is routed, authenticated, theme-enabled, and configuration-driven.

---

## 2) Bootstrap and provider flow

### 2.1 Runtime boot sequence

`main.tsx` wraps the app in this order:

1. `BrowserRouter`
2. `ThemeProvider`
3. `LeadFormRulesProvider`
4. `App`

So any page can use routing, theme context, and lead form rules context.

### 2.2 Why provider order matters

- Theme is global and must apply before page render.
- Lead form rules affect lead create validation and must be available to lead pages immediately.

---

## 3) Routing flow (user journey map)

Defined in `admin-web/src/App.tsx`.

### Public route

- `/login` ? `LoginPage`

### Protected area

`ProtectedRoute` checks auth state:

- `isReady = false` ? loading screen
- not authenticated ? redirect to `/login`
- authenticated ? render app shell and feature routes

### Main application routes (inside `AppShell`)

- `/` ? Dashboard
- `/leads` ? Leads list
- `/leads/:leadId` ? Lead detail
- `/reports` ? Reports
- `/settings` ? Theme/appearance settings
- `/configuration/*` ? Configuration module hub and submodules

### Configuration nested routes

- `/configuration` (overview)
- `/configuration/lead-form`
- `/configuration/employees`
- `/configuration/products`
- `/configuration/verticals`
- `/configuration/roles`
- `/configuration/functions`
- `/configuration/vertical-role-mapping`
- `/configuration/role-function-mapping`
- `/configuration/product-documents`
- `/configuration/bulk-upload`
- `/configuration/links`
- `/configuration/attendance`

Unknown routes redirect to `/`.

---

## 4) Authentication flow

Key files:

- `features/auth/AuthContext.tsx`
- `features/auth/ProtectedRoute.tsx`
- `features/auth/LoginPage.tsx`
- `api/authApi.ts`
- `api/httpClient.ts`

### 4.1 Login

1. User submits email + password on `LoginPage`.
2. `loginRequest()` calls `POST /api/v1/auth/login`.
3. On success:
   - token stored in `sessionStorage` (`ACCESS_TOKEN_KEY`)
   - user profile stored in `sessionStorage` (`USER_KEY`)
   - navigate to `/`

### 4.2 Session restore

On refresh, `AuthProvider` checks `sessionStorage`:

- if token + user are present ? user session restored
- then `isReady` becomes true

### 4.3 Unauthorized handling

`httpJson()` in `httpClient.ts`:

- if API returns `401`, it clears session keys and dispatches `lms:unauthorized`
- `AuthProvider` listens for this event and navigates to `/login`

This centralizes logout-on-expired-token behavior.

---

## 5) Shell layout and navigation flow

Key files:

- `layout/AppShell.tsx`
- `layout/Sidebar.tsx`
- `layout/TopBar.tsx`

### 5.1 App shell

- Left: Sidebar navigation
- Top: TopBar (search, theme toggle, notifications, user info, logout)
- Main: `Outlet` for active route content

### 5.2 Mobile behavior

`AppShell` handles:

- sidebar open/close state
- backdrop click close
- escape key close
- body scroll lock while mobile nav is open
- auto-close nav when screen becomes desktop width
- swipe hook (`useMobileNavSwipe`)

---

## 6) API and data access flow

### 6.1 Shared HTTP client

`api/httpClient.ts`:

- builds JSON request
- injects bearer token header when available
- parses JSON safely
- throws on non-OK responses
- handles `401` globally

### 6.2 API module split

- `api/authApi.ts` ? auth endpoints
- `api/leadsApi.ts` ? leads and lead assignment
- `api/configApi.ts` ? all configuration modules + bulk upload jobs

### 6.3 Envelope pattern

API responses are expected in `ApiEnvelope<T>` shape:

- `success`
- `data`
- optional `error`

Each API method unwraps and throws a usable fallback error if needed.

---

## 7) Leads module flow

Key files:

- `features/leads/LeadsPage.tsx`
- `features/leads/CreateLeadPanel.tsx`
- `features/leads/LeadDetailPage.tsx`
- `features/leads/createLeadFieldConfig.ts`
- `features/leads/createLeadPayload.ts`

### 7.1 Leads list flow

1. `LeadsPage` loads data on mount.
2. If assignee filter is blank ? `fetchLeads()`.
3. If assignee filter has value ? `fetchLeadsByAssignedEmpId()`.
4. Client-side filters apply for:
   - text query
   - stage
5. Results display in table with stage badges.

### 7.2 Create lead flow

1. User opens drawer from Leads toolbar.
2. Drawer renders sections from `LEAD_CREATE_FIELD_DEFS`.
3. Required flags are read from `LeadFormRulesProvider` (dynamic behavior).
4. On submit:
   - validate fields using `validateLeadCreate`
   - build payload using `leadFormValuesToCreatePayload`
   - call `createLead`
   - close drawer and refresh lead list

### 7.3 Lead detail + reassignment flow

1. `LeadDetailPage` loads by route id (`/leads/:leadId`).
2. Displays detail + activity placeholder.
3. Reassign form posts `PUT /api/v1/leads/{id}/assign`.
4. Updated lead response is reflected in UI.

---

## 8) Configuration module flow

Configuration routes are grouped by `ConfigurationLayout` and nav data from `configNav.ts`.

### 8.1 Shared behavior

Most config pages follow this pattern:

1. Load table rows from config API
2. Open modal for add/edit
3. Submit to POST/PUT endpoint
4. Reload table
5. Close modal

### 8.2 Module types

- **Master modules** (`MasterModulePage`): generic code/name/active CRUD
- **Employees** (`EmployeesPage`): employee metadata + availability fields
- **Mappings** (`MappingModulePage`): relation tables using two dropdowns
- **Product documents** (`ProductDocumentsPage`): product-document links
- **Links** (`LinksModulePage`): resource/deep links
- **Attendance** (`AttendanceConfigPage`): policy timings and grace

### 8.3 Lead form rules flow

Key files:

- `LeadFormRulesContext.tsx`
- `leadFormRulesStorage.ts`
- `LeadFormRulesPage.tsx`

Flow:

1. Required field map is loaded from `localStorage`.
2. Admin toggles required flags in Lead Form Rules page.
3. New map is persisted and event `lms-lead-form-rules-changed` is dispatched.
4. Create lead drawer consumes same map and validation updates automatically.

This is a local-browser config today (not server persisted yet).

### 8.4 Bulk upload validation flow

Key file: `BulkLeadUploadPage.tsx`

1. User chooses CSV/XLS/XLSX.
2. CSV is parsed and validated client-side (`validateLeadCsv`).
3. Validation summary + row issues + preview are shown.
4. Upload audit record is created via `createBulkUploadJob`.
5. Recent job history is displayed.

Templates can be downloaded from the same page (CSV/XLS).

---

## 9) Theme and design system flow

Key files:

- `theme/ThemeProvider.tsx`
- `theme/themeStorage.ts`
- `features/settings/SettingsPage.tsx`
- `packages/design-tokens/*`

### 9.1 Theme state

Theme context tracks:

- mode (`light` / `dark`)
- accent preset
- font scale

### 9.2 Apply process

On theme change:

1. provider builds theme from design-tokens (`createTheme`)
2. CSS vars are generated (`themeToCssVariables`)
3. vars are applied to `document.documentElement`
4. metadata attributes (`data-theme`, `data-accent`, `data-fontScale`) are updated
5. choice is persisted in storage

### 9.3 User control points

- Top bar: quick light/dark toggle
- Settings page: full appearance customization

---

## 10) Reusable UI component strategy

Reusable primitives are under `admin-web/src/components/ui/`.

Examples:

- Buttons: `Button`
- Inputs: `TextField`, `SearchField`, `Select`, `SelectField`, `CheckboxField`
- Structure: `Card`, `PageHeader`, `Modal`
- Text and links: `Text`, `AppLink` helpers

Current direction is to standardize all screens on these shared components for consistent spacing, labels, and compact layout behavior.

---

## 11) Error and UX conventions

- API failures usually show inline `error-banner` or `crm-inline-alert`
- List pages show loading/empty states in table cards
- Dialogs and drawers support close actions, including outside click and Escape behavior where implemented
- Protected routes avoid rendering app content until auth readiness is known

---

## 12) Testing flow (current)

- Test runner: Vitest
- Existing tests include:
  - `features/leads/LeadsPage.test.tsx`
  - `theme/ThemeProvider.test.tsx`
  - API utility tests (`authApi`, `httpClient`, leads API)

Run:

- `npm run test -w admin-web`

---

## 13) KT handover checklist for new developers

1. Read this document + `docs/ARCHITECTURE_AND_REPO.md`.
2. Run admin web locally and navigate every route once.
3. Verify login + logout + unauthorized redirect flow.
4. Test create lead, lead detail, and reassignment.
5. Test one module from each configuration category (master, mapping, documents, attendance, bulk upload).
6. Change theme in settings and confirm persistence after refresh.
7. Before new UI work, check `components/ui/index.ts` for existing reusable components.

---

## 14) Recommended next documentation additions

- Sequence diagrams for login, create lead, and bulk upload
- API contract table with request/response examples per endpoint
- Component usage matrix (which pages still use raw HTML controls vs shared components)
- Production deployment + environment configuration guide

---

## Quick command reference

From `lms-platform/`:

- Install deps: `npm install`
- Run admin web: `npm run dev -w admin-web`
- Build admin web: `npm run build -w admin-web`
- Test admin web: `npm run test -w admin-web`

