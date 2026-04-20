package com.lms.lead.application;

import com.lms.lead.domain.LeadPriority;
import com.lms.lead.domain.LeadStage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateLeadCommand(
        @Size(max = 32) String leadId,
        @NotBlank @Size(max = 200) String fullName,
        @NotBlank @Email @Size(max = 320) String email,
        @Size(max = 40) String mobile,
        @Size(max = 200) String companyName,
        @Size(max = 80) String leadSource,
        @Size(max = 255) String productInterested,
        @Size(max = 100) String budget,
        @Size(max = 2000) String description,
        @Size(max = 120) String country,
        @Size(max = 120) String state,
        @Size(max = 120) String city,
        @Size(max = 20) String pincode,
        LeadStage status,
        LeadPriority priority,
        @Size(max = 120) String assignedTo,
        LocalDate expectedCloseDate,
        @Size(max = 80) String campaignId
) {
}
