/** Configuration hub — admin modules; mobile will consume APIs derived from these settings later. */
export const CONFIG_NAV = [
  { to: "/configuration", label: "Overview", end: true as const },
  { to: "/configuration/lead-form", label: "Lead form rules", end: false as const },
  { to: "/configuration/employees", label: "User create (Employee)", end: false as const },
  { to: "/configuration/products", label: "Add product", end: false as const },
  { to: "/configuration/verticals", label: "Add vertical", end: false as const },
  { to: "/configuration/roles", label: "Add role", end: false as const },
  { to: "/configuration/functions", label: "Add function", end: false as const },
  { to: "/configuration/vertical-role-mapping", label: "Vertical ↔ role mapping", end: false as const },
  { to: "/configuration/role-function-mapping", label: "Role ↔ function mapping", end: false as const },
  { to: "/configuration/product-documents", label: "Product documents", end: false as const },
  { to: "/configuration/bulk-upload", label: "Bulk upload (Excel / CSV / PDF)", end: false as const },
  { to: "/configuration/links", label: "Add link", end: false as const },
  { to: "/configuration/attendance", label: "Check-in / check-out times", end: false as const },
] as const;
