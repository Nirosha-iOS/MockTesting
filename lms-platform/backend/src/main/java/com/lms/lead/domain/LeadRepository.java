package com.lms.lead.domain;

import java.util.List;
import java.util.Optional;

public interface LeadRepository {

    Lead save(Lead lead);

    Optional<Lead> findById(Long id);

    List<Lead> findAll();

    List<Lead> findByAssignedTo(String assignedTo);
}
