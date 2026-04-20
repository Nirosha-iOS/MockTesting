package com.lms.lead.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadJpaRepository extends JpaRepository<LeadEntity, Long> {
    List<LeadEntity> findByAssignedToIgnoreCase(String assignedTo);
}
