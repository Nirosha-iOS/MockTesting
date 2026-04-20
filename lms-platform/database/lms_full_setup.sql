-- =========================================================
-- LMS Full Database Setup
-- Purpose:
--   One-time setup for local/dev environments.
--   Creates database, tables, primary keys, unique keys,
--   indexes, and foreign keys required by admin + leads flow.
--
-- Copy/paste friendly single file (instructions + same schema):
--   See LMS_MYSQL_COPY_PASTE_SETUP.sql in this folder.
--
-- Usage:
--   1) Open MySQL Workbench
--   2) Run this whole script
--   3) Refresh schema and verify tables
-- =========================================================

CREATE DATABASE IF NOT EXISTS lms
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE lms;

-- ---------------------------------------------------------
-- Keys: PK on every table = `id`. UKs on codes/emails/composites.
-- FKs (Section "Foreign Keys" below):
--   cfg_vertical_role_map -> cfg_verticals, cfg_roles
--   cfg_role_function_map -> cfg_roles, cfg_functions
--   cfg_product_documents -> cfg_products
--   lead_assignment_history -> leads
-- Full named PK list + verification queries: LMS_MYSQL_COPY_PASTE_SETUP.sql
-- ---------------------------------------------------------

-- ---------------------------------------------------------
-- Core Leads
-- ---------------------------------------------------------
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
  PRIMARY KEY (id),
  UNIQUE KEY uk_leads_lead_code (lead_code)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Employee / User Master
-- ---------------------------------------------------------
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
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfg_employees_employee_code (employee_code),
  UNIQUE KEY uk_cfg_employees_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Config Masters
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS cfg_products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfg_products_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cfg_verticals (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfg_verticals_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cfg_roles (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfg_roles_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cfg_functions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(80) NOT NULL,
  name VARCHAR(200) NOT NULL,
  active BIT(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfg_functions_code (code)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Mapping Tables
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS cfg_vertical_role_map (
  id BIGINT NOT NULL AUTO_INCREMENT,
  vertical_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfg_vertical_role (vertical_id, role_id),
  KEY idx_vrm_vertical_id (vertical_id),
  KEY idx_vrm_role_id (role_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cfg_role_function_map (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  function_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfg_role_function (role_id, function_id),
  KEY idx_rfm_role_id (role_id),
  KEY idx_rfm_function_id (function_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Product Documents
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS cfg_product_documents (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  document_name VARCHAR(200) NOT NULL,
  document_url VARCHAR(1000) NOT NULL,
  document_type VARCHAR(80) NULL,
  PRIMARY KEY (id),
  KEY idx_prod_docs_product_id (product_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Bulk Upload Audit
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS cfg_bulk_upload_jobs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(16) NOT NULL,
  status VARCHAR(32) NOT NULL,
  total_rows INT NOT NULL,
  success_rows INT NOT NULL,
  error_rows INT NOT NULL,
  created_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_bulk_jobs_created_at (created_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Links
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS cfg_resource_links (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  category VARCHAR(80) NULL,
  active BIT(1) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Attendance Config
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS cfg_attendance_config (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  grace_minutes INT NOT NULL,
  active BIT(1) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Lead Reassignment History
-- ---------------------------------------------------------
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
  PRIMARY KEY (id),
  KEY idx_lah_lead_id (lead_id),
  KEY idx_lah_to_emp_id (to_emp_id),
  KEY idx_lah_created_at (created_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Foreign Keys
-- ---------------------------------------------------------
ALTER TABLE cfg_vertical_role_map
  ADD CONSTRAINT fk_cfg_vrm_vertical
  FOREIGN KEY (vertical_id) REFERENCES cfg_verticals(id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_vertical_role_map
  ADD CONSTRAINT fk_cfg_vrm_role
  FOREIGN KEY (role_id) REFERENCES cfg_roles(id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_role_function_map
  ADD CONSTRAINT fk_cfg_rfm_role
  FOREIGN KEY (role_id) REFERENCES cfg_roles(id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_role_function_map
  ADD CONSTRAINT fk_cfg_rfm_function
  FOREIGN KEY (function_id) REFERENCES cfg_functions(id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE cfg_product_documents
  ADD CONSTRAINT fk_cfg_prod_doc_product
  FOREIGN KEY (product_id) REFERENCES cfg_products(id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE lead_assignment_history
  ADD CONSTRAINT fk_lead_assignment_history_lead
  FOREIGN KEY (lead_id) REFERENCES leads(id)
  ON UPDATE CASCADE ON DELETE CASCADE;

-- ---------------------------------------------------------
-- Helpful secondary indexes
-- ---------------------------------------------------------
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_by ON leads(created_by);
CREATE INDEX idx_leads_stage ON leads(stage);

-- ---------------------------------------------------------
-- Verification
-- ---------------------------------------------------------
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'lms'
ORDER BY table_name;

-- Primary keys (all tables)
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

-- Foreign keys
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
