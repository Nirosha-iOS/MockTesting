package com.lms.lead.infrastructure;

import com.lms.lead.domain.Lead;
import com.lms.lead.domain.LeadRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
class LeadRepositoryAdapter implements LeadRepository {

    private final LeadJpaRepository jpaRepository;
    private final LeadPersistenceMapper mapper;

    LeadRepositoryAdapter(LeadJpaRepository jpaRepository, LeadPersistenceMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Lead save(Lead lead) {
        LeadEntity e = mapper.toNewEntity(lead);
        LeadEntity saved = jpaRepository.save(e);
        if (saved.getLeadCode() == null || saved.getLeadCode().isBlank()) {
            saved.setLeadCode("LD" + saved.getId());
            saved = jpaRepository.save(saved);
        }
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Lead> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Lead> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Lead> findByAssignedTo(String assignedTo) {
        return jpaRepository.findByAssignedToIgnoreCase(assignedTo).stream().map(mapper::toDomain).toList();
    }
}
