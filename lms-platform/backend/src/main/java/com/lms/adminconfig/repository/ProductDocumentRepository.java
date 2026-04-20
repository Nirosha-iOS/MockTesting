package com.lms.adminconfig.repository;

import com.lms.adminconfig.entity.ProductDocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDocumentRepository extends JpaRepository<ProductDocumentEntity, Long> {
}
