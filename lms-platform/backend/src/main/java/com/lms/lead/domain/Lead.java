package com.lms.lead.domain;

import java.time.Instant;
import java.time.LocalDate;

public record Lead(
        Long id,
        String leadCode,
        String fullName,
        String email,
        String phone,
        String company,
        String leadSource,
        String productInterested,
        String budget,
        String description,
        String country,
        String state,
        String city,
        String pincode,
        LeadStage stage,
        LeadPriority priority,
        String assignedTo,
        LocalDate expectedCloseDate,
        String campaignId,
        Instant createdAt,
        Instant updatedAt,
        String createdBy
) {
}
