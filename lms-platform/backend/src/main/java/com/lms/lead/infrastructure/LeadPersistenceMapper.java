package com.lms.lead.infrastructure;

import com.lms.lead.domain.Lead;
import org.springframework.stereotype.Component;

@Component
class LeadPersistenceMapper {

    LeadEntity toNewEntity(Lead domain) {
        LeadEntity e = new LeadEntity();
        e.setId(domain.id());
        e.setLeadCode(domain.leadCode());
        e.setFullName(domain.fullName());
        e.setEmail(domain.email());
        e.setPhone(domain.phone());
        e.setCompany(domain.company());
        e.setLeadSource(domain.leadSource());
        e.setProductInterested(domain.productInterested());
        e.setBudget(domain.budget());
        e.setDescription(domain.description());
        e.setCountry(domain.country());
        e.setState(domain.state());
        e.setCity(domain.city());
        e.setPincode(domain.pincode());
        e.setStage(domain.stage());
        e.setPriority(domain.priority());
        e.setAssignedTo(domain.assignedTo());
        e.setExpectedCloseDate(domain.expectedCloseDate());
        e.setCampaignId(domain.campaignId());
        e.setCreatedAt(domain.createdAt());
        e.setUpdatedAt(domain.updatedAt());
        e.setCreatedBy(domain.createdBy());
        return e;
    }

    Lead toDomain(LeadEntity entity) {
        return new Lead(
                entity.getId(),
                entity.getLeadCode(),
                entity.getFullName(),
                entity.getEmail(),
                entity.getPhone() != null ? entity.getPhone() : "",
                entity.getCompany(),
                entity.getLeadSource(),
                entity.getProductInterested(),
                entity.getBudget(),
                entity.getDescription(),
                entity.getCountry(),
                entity.getState(),
                entity.getCity(),
                entity.getPincode(),
                entity.getStage(),
                entity.getPriority(),
                entity.getAssignedTo(),
                entity.getExpectedCloseDate(),
                entity.getCampaignId(),
                entity.getCreatedAt(),
                entity.getUpdatedAt() != null ? entity.getUpdatedAt() : entity.getCreatedAt(),
                entity.getCreatedBy()
        );
    }
}
