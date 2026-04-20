package com.lms.adminconfig.repository;

import com.lms.adminconfig.entity.RoleFunctionMappingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleFunctionMappingRepository extends JpaRepository<RoleFunctionMappingEntity, Long> {
}
