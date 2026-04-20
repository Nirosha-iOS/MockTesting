package com.lms.lead.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadAssignmentHistoryRepository extends JpaRepository<LeadAssignmentHistoryEntity, Long> {
}
