-- =============================================================================
-- LMS Platform — MySQL schema (copy / paste / run)
-- =============================================================================
--
-- What this file does
--   Creates the `lms` database (if missing) and all tables, keys, foreign keys,
--   and indexes used by the Spring Boot backend (leads + admin configuration).
--
-- Requirements
--   • MySQL 8.0+ recommended (uses utf8mb4_0900_ai_ci).
--   • For MySQL 5.7: change the COLLATE line below to utf8mb4_unicode_ci.
--
-- How to run (another machine)
--   1. Open MySQL Workbench, DBeaver, or `mysql` CLI as a user with CREATE rights.
--   2. Paste this entire file and execute once on an empty or new environment.
--   3. If you already ran it before: do NOT re-run SECTION 2–3 unless you dropped
--      foreign keys / indexes first (duplicate constraint / index errors).
--
-- Tables created (13)
--   leads, cfg_employees, cfg_products, cfg_verticals, cfg_roles, cfg_functions,
--   cfg_vertical_role_map, cfg_role_function_map, cfg_product_documents,
--   cfg_bulk_upload_jobs, cfg_resource_links, cfg_attendance_config,
--   lead_assignment_history
--
-- -----------------------------------------------------------------------------
-- KEY SUMMARY — Primary keys (PK), unique keys (UK), foreign keys (FK)
-- -----------------------------------------------------------------------------
--
-- PRIMARY KEY (every table): single surrogate column `id` BIGINT AUTO_INCREMENT,
--   constraint name `PRIMARY` (MySQL default).
--
-- UNIQUE keys (business / composite):
--   leads                    UK  uk_leads_lead_code              (lead_code)
--   cfg_employees            UK  uk_cfg_employees_employee_code  (employee_code)
--                            UK  uk_cfg_employees_email          (email)
--   cfg_products             UK  uk_cfg_products_code            (code)
--   cfg_verticals            UK  uk_cfg_verticals_code           (code)
--   cfg_roles                  UK  uk_cfg_roles_code               (code)
--   cfg_functions              UK  uk_cfg_functions_code           (code)
--   cfg_vertical_role_map      UK  uk_cfg_vertical_role            (vertical_id, role_id)
--   cfg_role_function_map      UK  uk_cfg_role_function            (role_id, function_id)
--
-- FOREIGN KEY constraints (Section 2 — enforced in MySQL):
--   fk_cfg_vrm_vertical        cfg_vertical_role_map.vertical_id  -> cfg_verticals.id
--   fk_cfg_vrm_role            cfg_vertical_role_map.role_id        -> cfg_roles.id
--   fk_cfg_rfm_role            cfg_role_function_map.role_id        -> cfg_roles.id
--   fk_cfg_rfm_function        cfg_role_function_map.function_id    -> cfg_functions.id
--   fk_cfg_prod_doc_product    cfg_product_documents.product_id     -> cfg_products.id
--   fk_lead_assignment_history_lead  lead_assignment_history.lead_id -> leads.id
--
-- Logical links (no FK — app stores codes / text, not row ids):
--   leads.created_by, leads.assigned_to  ->  cfg_employees.employee_code (application enforced)
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SECTION 0 — Database (edit collation for MySQL 5.7 if needed)
-- -----------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS lms
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE lms;

-- -----------------------------------------------------------------------------
-- SECTION 1 — Tables (safe to re-run: IF NOT EXISTS)
-- -----------------------------------------------------------------------------

-- Core leads
--   PK: id  |  UK: lead_code  |  FK: none (see KEY SUMMARY for logical employee codes)
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT NOT NULL AUTO_INCREMENT,
  lead_code VARCHAR(32) NULL,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(40) NULL,
  company VARCHAR(200) NULL,
  lead_source VARCHAR(80) NULL,
  product_interested VARCHAR(255) NULL,
  budget VARCHAR(100) NULL,
  description VARCHAR(2000) NULL,
  country VARCHAR(120) NULL,
  state VARCHAR(120) NULL,
  city VARCHAR(120) NULL,
  pincode VARCHAR(20) NULL,
  stage VARCHAR(32) NOT NULL,
  priority VARCHAR(16) NULL,
  assigned_to VARCHAR(120) NULL,
  expected_close_date DATE NULL,
  campaign_id VARCHAR(80) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  created_by VARCHAR(80) NULL,
  CONSTRAINT pk_leads PRIMARY KEY (id),
  CONSTRAINT uk_leads_lead_code UNIQUE (lead_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Employees (linked logically from leads.created_by / assigned_to as employee codes)
--   PK: id  |  UK: employee_code, email  |  FK: none
CREATE TABLE IF NOT EXISTS cfg_employees (
  id BIGINT NOT NULL AUTO_INCREMENT,
  employee_code VARCHAR(40) NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(40) NULL,
  department VARCHAR(120) NULL,
  designation VARCHAR(120) NULL,
  manager_emp_code VARCHAR(40) NULL,
  unavailable_from DATE NULL,
  unavailable_to DATE NULL,
  active BIT(1) NOT NULL,
  CONSTRAINT pk_cfg_employees PRIMARY KEY (id),
  CONSTRAINT uk_cfg_employees_employee_code UNIQUE (employee_code),
  CONSTRAINT uk_cfg_employees_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Master data
--   PK: id  |  UK: code  |  FK: none
CREATE TABLE IF NOT EXISTS cfg_products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  CONSTRAINT pk_cfg_products PRIMARY KEY (id),
  CONSTRAINT uk_cfg_products_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--   PK: id  |  UK: code  |  FK: none (parent for cfg_vertical_role_map)
CREATE TABLE IF NOT EXISTS cfg_verticals (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  CONSTRAINT pk_cfg_verticals PRIMARY KEY (id),
  CONSTRAINT uk_cfg_verticals_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--   PK: id  |  UK: code  |  FK: none (parent for vertical_role + role_function maps)
CREATE TABLE IF NOT EXISTS cfg_roles (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  CONSTRAINT pk_cfg_roles PRIMARY KEY (id),
  CONSTRAINT uk_cfg_roles_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--   PK: id  |  UK: code  |  FK: none (parent for cfg_role_function_map)
CREATE TABLE IF NOT EXISTS cfg_functions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(80) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  CONSTRAINT pk_cfg_functions PRIMARY KEY (id),
  CONSTRAINT uk_cfg_functions_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Mappings
--   PK: id  |  UK: (vertical_id, role_id)  |  FK: Section 2 -> cfg_verticals, cfg_roles
CREATE TABLE IF NOT EXISTS cfg_vertical_role_map (
  id BIGINT NOT NULL AUTO_INCREMENT,
  vertical_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  CONSTRAINT pk_cfg_vertical_role_map PRIMARY KEY (id),
  CONSTRAINT uk_cfg_vertical_role UNIQUE (vertical_id, role_id),
  KEY idx_vrm_vertical_id (vertical_id),
  KEY idx_vrm_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--   PK: id  |  UK: (role_id, function_id)  |  FK: Section 2 -> cfg_roles, cfg_functions
CREATE TABLE IF NOT EXISTS cfg_role_function_map (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  function_id BIGINT NOT NULL,
  CONSTRAINT pk_cfg_role_function_map PRIMARY KEY (id),
  CONSTRAINT uk_cfg_role_function UNIQUE (role_id, function_id),
  KEY idx_rfm_role_id (role_id),
  KEY idx_rfm_function_id (function_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Product documents
--   PK: id  |  FK: Section 2 -> cfg_products.id on product_id
CREATE TABLE IF NOT EXISTS cfg_product_documents (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  document_name VARCHAR(200) NOT NULL,
  document_url VARCHAR(1000) NOT NULL,
  document_type VARCHAR(80) NULL,
  CONSTRAINT pk_cfg_product_documents PRIMARY KEY (id),
  KEY idx_prod_docs_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bulk upload audit
--   PK: id  |  FK: none
CREATE TABLE IF NOT EXISTS cfg_bulk_upload_jobs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(16) NOT NULL,
  status VARCHAR(32) NOT NULL,
  total_rows INT NOT NULL,
  success_rows INT NOT NULL,
  error_rows INT NOT NULL,
  created_at DATETIME(6) NOT NULL,
  CONSTRAINT pk_cfg_bulk_upload_jobs PRIMARY KEY (id),
  KEY idx_bulk_jobs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Resource links
--   PK: id  |  FK: none
CREATE TABLE IF NOT EXISTS cfg_resource_links (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  category VARCHAR(80) NULL,
  active BIT(1) NOT NULL,
  CONSTRAINT pk_cfg_resource_links PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Attendance windows
--   PK: id  |  FK: none
CREATE TABLE IF NOT EXISTS cfg_attendance_config (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  grace_minutes INT NOT NULL,
  active BIT(1) NOT NULL,
  CONSTRAINT pk_cfg_attendance_config PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Lead reassignment audit
--   PK: id  |  FK: Section 2 -> leads.id on lead_id
CREATE TABLE IF NOT EXISTS lead_assignment_history (
  id BIGINT NOT NULL AUTO_INCREMENT,
  lead_id BIGINT NOT NULL,
  from_emp_id VARCHAR(40) NULL,
  to_emp_id VARCHAR(40) NOT NULL,
  reason VARCHAR(255) NULL,
  unavailable_from DATE NULL,
  unavailable_to DATE NULL,
  changed_by VARCHAR(80) NOT NULL,
  created_at DATETIME(6) NOT NULL,
  CONSTRAINT pk_lead_assignment_history PRIMARY KEY (id),
  KEY idx_lah_lead_id (lead_id),
  KEY idx_lah_to_emp_id (to_emp_id),
  KEY idx_lah_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------------
-- SECTION 2 — FOREIGN KEY constraints (run once; duplicate name = already applied)
-- -----------------------------------------------------------------------------

ALTER TABLE cfg_vertical_role_map
  ADD CONSTRAINT fk_cfg_vrm_vertical
  FOREIGN KEY (vertical_id) REFERENCES cfg_verticals (id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_vertical_role_map
  ADD CONSTRAINT fk_cfg_vrm_role
  FOREIGN KEY (role_id) REFERENCES cfg_roles (id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_role_function_map
  ADD CONSTRAINT fk_cfg_rfm_role
  FOREIGN KEY (role_id) REFERENCES cfg_roles (id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_role_function_map
  ADD CONSTRAINT fk_cfg_rfm_function
  FOREIGN KEY (function_id) REFERENCES cfg_functions (id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_product_documents
  ADD CONSTRAINT fk_cfg_prod_doc_product
  FOREIGN KEY (product_id) REFERENCES cfg_products (id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE lead_assignment_history
  ADD CONSTRAINT fk_lead_assignment_history_lead
  FOREIGN KEY (lead_id) REFERENCES leads (id)
  ON UPDATE CASCADE ON DELETE CASCADE;

-- -----------------------------------------------------------------------------
-- SECTION 3 — Secondary indexes on leads (run once; skip if index exists)
-- -----------------------------------------------------------------------------

CREATE INDEX idx_leads_assigned_to ON leads (assigned_to);
CREATE INDEX idx_leads_created_by ON leads (created_by);
CREATE INDEX idx_leads_stage ON leads (stage);

-- -----------------------------------------------------------------------------
-- SECTION 4 — Verification (optional)
-- -----------------------------------------------------------------------------

-- All PRIMARY KEY columns in `lms`
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

SELECT table_name AS table_name
FROM information_schema.tables
WHERE table_schema = 'lms'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

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

-- =============================================================================
-- End of script
-- =============================================================================
