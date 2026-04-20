package com.lms.adminconfig.repository;

import com.lms.adminconfig.entity.BulkUploadJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BulkUploadJobRepository extends JpaRepository<BulkUploadJobEntity, Long> {
}
