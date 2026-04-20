# LMS Database Setup and Query Guide (Team KT)

This document is for the full team to quickly set up the LMS database and run day-to-day SQL queries for support, QA, and development.

---

## 1) Purpose

- Create the `lms` MySQL database in a new machine/environment.
- Provide standard verification queries after setup.
- Provide reusable operational queries for Leads and Configuration modules.

---

## 2) Source SQL files

Use these files from `lms-platform/database/`:

- `LMS_MYSQL_COPY_PASTE_SETUP.sql` (recommended for manual copy/paste setup)
- `lms_full_setup.sql` (full one-time setup script)

Both create the same schema and constraints.

---

## 3) Prerequisites

- MySQL 8.0+ recommended.
- DB user with `CREATE`, `ALTER`, `INDEX`, and DML permissions.
- For MySQL 5.7, change collation in script from:
  - `utf8mb4_0900_ai_ci`
  - to `utf8mb4_unicode_ci`

---

## 4) Database create flow (new environment)

### Option A: MySQL Workbench / DBeaver

1. Open SQL editor using admin DB user.
2. Open `LMS_MYSQL_COPY_PASTE_SETUP.sql`.
3. Execute full script once.
4. Refresh schema list and confirm `lms` appears.

### Option B: MySQL CLI

```bash
mysql -u <db_user> -p < "LMS_MYSQL_COPY_PASTE_SETUP.sql"
```

---

## 5) What gets created

### Database

- `lms`

### Main tables (13)

- `leads`
- `cfg_employees`
- `cfg_products`
- `cfg_verticals`
- `cfg_roles`
- `cfg_functions`
- `cfg_vertical_role_map`
- `cfg_role_function_map`
- `cfg_product_documents`
- `cfg_bulk_upload_jobs`
- `cfg_resource_links`
- `cfg_attendance_config`
- `lead_assignment_history`

### Core constraints

- PK on `id` for all tables
- Unique keys on business codes/emails/composite maps
- Foreign keys for mapping, product-doc, and assignment history links
- Secondary indexes for common lead filters (`assigned_to`, `created_by`, `stage`)

---

## 6) Setup verification queries

Run after setup:

```sql
USE lms;

-- 1) Table list
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'lms' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2) Primary keys
SELECT
  t.table_name,
  kcu.column_name,
  kcu.ordinal_position
FROM information_schema.table_constraints t
JOIN information_schema.key_column_usage kcu
  ON t.constraint_schema = kcu.constraint_schema
 AND t.table_name = kcu.table_name
 AND t.constraint_name = kcu.constraint_name
WHERE t.table_schema = 'lms'
  AND t.constraint_type = 'PRIMARY KEY'
ORDER BY t.table_name, kcu.ordinal_position;

-- 3) Foreign keys
SELECT
  rc.constraint_name,
  rc.table_name,
  kcu.column_name,
  rc.referenced_table_name,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu
  ON rc.constraint_schema = kcu.constraint_schema
 AND rc.constraint_name = kcu.constraint_name
 AND rc.table_name = kcu.table_name
WHERE rc.constraint_schema = 'lms'
ORDER BY rc.table_name, rc.constraint_name, kcu.ordinal_position;
```

---

## 7) Team day-to-day query snippets

> Use `USE lms;` first.

### 7.1 Leads

```sql
-- Latest leads
SELECT id, lead_code, full_name, email, stage, assigned_to, created_at
FROM leads
ORDER BY created_at DESC
LIMIT 100;

-- Leads by stage
SELECT stage, COUNT(*) AS total
FROM leads
GROUP BY stage
ORDER BY total DESC;

-- Leads by assignee
SELECT assigned_to, COUNT(*) AS total
FROM leads
GROUP BY assigned_to
ORDER BY total DESC;

-- Search by name/email/phone
SELECT id, lead_code, full_name, email, phone, stage
FROM leads
WHERE full_name LIKE '%john%'
   OR email LIKE '%john%'
   OR phone LIKE '%9876%'
ORDER BY updated_at DESC;
```

### 7.2 Assignment history

```sql
-- Lead reassignment timeline
SELECT
  lah.id,
  lah.lead_id,
  l.lead_code,
  l.full_name,
  lah.from_emp_id,
  lah.to_emp_id,
  lah.reason,
  lah.changed_by,
  lah.created_at
FROM lead_assignment_history lah
JOIN leads l ON l.id = lah.lead_id
ORDER BY lah.created_at DESC
LIMIT 200;
```

### 7.3 Employees and config masters

```sql
-- Active employees
SELECT id, employee_code, name, email, department, designation
FROM cfg_employees
WHERE active = b'1'
ORDER BY name;

-- Master data totals
SELECT 'products' AS module, COUNT(*) AS total FROM cfg_products
UNION ALL
SELECT 'verticals', COUNT(*) FROM cfg_verticals
UNION ALL
SELECT 'roles', COUNT(*) FROM cfg_roles
UNION ALL
SELECT 'functions', COUNT(*) FROM cfg_functions;
```

### 7.4 Mapping health

```sql
-- Vertical-role mappings with names
SELECT m.id, v.name AS vertical_name, r.name AS role_name
FROM cfg_vertical_role_map m
JOIN cfg_verticals v ON v.id = m.vertical_id
JOIN cfg_roles r ON r.id = m.role_id
ORDER BY v.name, r.name;

-- Role-function mappings with names
SELECT m.id, r.name AS role_name, f.name AS function_name
FROM cfg_role_function_map m
JOIN cfg_roles r ON r.id = m.role_id
JOIN cfg_functions f ON f.id = m.function_id
ORDER BY r.name, f.name;
```

### 7.5 Product documents / links / attendance / bulk upload jobs

```sql
-- Product documents
SELECT d.id, p.name AS product_name, d.document_name, d.document_type, d.document_url
FROM cfg_product_documents d
JOIN cfg_products p ON p.id = d.product_id
ORDER BY p.name, d.document_name;

-- Active resource links
SELECT id, title, url, category
FROM cfg_resource_links
WHERE active = b'1'
ORDER BY title;

-- Attendance policies
SELECT id, name, check_in_time, check_out_time, grace_minutes, active
FROM cfg_attendance_config
ORDER BY name;

-- Bulk upload job audit (latest)
SELECT id, file_name, file_type, status, total_rows, success_rows, error_rows, created_at
FROM cfg_bulk_upload_jobs
ORDER BY created_at DESC
LIMIT 100;
```

---

## 8) Data fix examples (safe patterns)

```sql
-- Example: set lead stage
UPDATE leads
SET stage = 'CONTACTED', updated_at = NOW(6)
WHERE id = 123;

-- Example: deactivate an employee
UPDATE cfg_employees
SET active = b'0'
WHERE employee_code = 'EMP001';
```

Recommendation:

- Always run an equivalent `SELECT` first.
- Prefer transactions for production changes.

---

## 9) Troubleshooting

### Duplicate FK/index errors while re-running script

Cause: FK/index already exists.

Action:

- Prefer one-time run for Sections that add FKs/indexes.
- If rerun is required, drop conflicting constraints/indexes first.

### Collation error on older MySQL

Action:

- Replace `utf8mb4_0900_ai_ci` with `utf8mb4_unicode_ci` and rerun.

### Access denied

Action:

- Ensure DB user has `CREATE`, `ALTER`, `INDEX`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

---

## 10) Team usage checklist

- [ ] Setup DB from one of the approved SQL files
- [ ] Run verification queries
- [ ] Confirm 13 tables exist
- [ ] Validate PK/FK presence
- [ ] Share any environment-specific overrides (host/user/collation) with team

---

## 11) Reference

- Architecture doc: `docs/ARCHITECTURE_AND_REPO.md`
- Schema scripts: `database/LMS_MYSQL_COPY_PASTE_SETUP.sql`, `database/lms_full_setup.sql`
