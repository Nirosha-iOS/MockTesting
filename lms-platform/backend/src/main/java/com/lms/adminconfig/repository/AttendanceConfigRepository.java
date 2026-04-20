package com.lms.adminconfig.repository;

import com.lms.adminconfig.entity.AttendanceConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceConfigRepository extends JpaRepository<AttendanceConfigEntity, Long> {
}
