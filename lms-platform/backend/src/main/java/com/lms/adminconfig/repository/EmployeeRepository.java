package com.lms.adminconfig.repository;

import com.lms.adminconfig.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {
    Optional<EmployeeEntity> findByEmailIgnoreCase(String email);
    Optional<EmployeeEntity> findByEmployeeCode(String employeeCode);
}
