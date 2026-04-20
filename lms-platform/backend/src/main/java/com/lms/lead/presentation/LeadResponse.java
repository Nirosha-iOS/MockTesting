package com.lms.lead.presentation;

import com.lms.lead.application.LeadDto;
import com.lms.lead.domain.LeadStage;

import java.time.Instant;
import java.time.LocalDate;

public record LeadResponse(
        Long id,
        String leadId,
        String fullName,
        String mobile,
        String email,
        String companyName,
        String leadSource,
        String productInterested,
        String budget,
        String description,
        String country,
        String state,
        String city,
        String pincode,
        String status,
        LeadStage stage,
        String priority,
        String assignedTo,
        LocalDate expectedCloseDate,
        String campaignId,
        Instant createdDate,
        Instant updatedDate,
        String createdBy
) {
    static LeadResponse from(LeadDto dto) {
        return new LeadResponse(
                dto.id(),
                dto.leadCode(),
                dto.fullName(),
                dto.phone(),
                dto.email(),
                dto.company(),
                dto.leadSource(),
                dto.productInterested(),
                dto.budget(),
                dto.description(),
                dto.country(),
                dto.state(),
                dto.city(),
                dto.pincode(),
                dto.stage().name(),
                dto.stage(),
                dto.priority() != null ? dto.priority().name() : null,
                dto.assignedTo(),
                dto.expectedCloseDate(),
                dto.campaignId(),
                dto.createdAt(),
                dto.updatedAt(),
                dto.createdBy()
        );
    }
}
