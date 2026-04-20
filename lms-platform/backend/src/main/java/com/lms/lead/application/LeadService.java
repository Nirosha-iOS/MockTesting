package com.lms.lead.application;

import com.lms.adminconfig.entity.EmployeeEntity;
import com.lms.adminconfig.repository.EmployeeRepository;
import com.lms.lead.domain.Lead;
import com.lms.lead.domain.LeadRepository;
import com.lms.lead.domain.LeadStage;
import com.lms.lead.infrastructure.LeadAssignmentHistoryEntity;
import com.lms.lead.infrastructure.LeadAssignmentHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final EmployeeRepository employeeRepository;
    private final LeadAssignmentHistoryRepository assignmentHistoryRepository;

    public LeadService(
            LeadRepository leadRepository,
            EmployeeRepository employeeRepository,
            LeadAssignmentHistoryRepository assignmentHistoryRepository
    ) {
        this.leadRepository = leadRepository;
        this.employeeRepository = employeeRepository;
        this.assignmentHistoryRepository = assignmentHistoryRepository;
    }

    @Transactional
    public LeadDto create(CreateLeadCommand command, String actorPrincipal) {
        Instant now = Instant.now();
        LeadStage stage = command.status() != null ? command.status() : LeadStage.NEW;
        String leadCode = blankToNull(command.leadId());
        String creatorEmpId = resolveActorEmployeeId(actorPrincipal);
        String assignedEmpId = blankToNull(command.assignedTo());
        if (assignedEmpId == null) {
            assignedEmpId = creatorEmpId;
        } else {
            validateEmployeeExists(assignedEmpId);
        }
        Lead toSave = new Lead(
                null,
                leadCode,
                command.fullName().trim(),
                command.email().trim().toLowerCase(),
                command.mobile() == null ? "" : command.mobile().trim(),
                blankToNull(command.companyName()),
                blankToNull(command.leadSource()),
                blankToNull(command.productInterested()),
                blankToNull(command.budget()),
                blankToNull(command.description()),
                blankToNull(command.country()),
                blankToNull(command.state()),
                blankToNull(command.city()),
                blankToNull(command.pincode()),
                stage,
                command.priority(),
                assignedEmpId,
                command.expectedCloseDate(),
                blankToNull(command.campaignId()),
                now,
                now,
                creatorEmpId
        );
        Lead saved = leadRepository.save(toSave);
        return toDto(saved);
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String t = value.trim();
        return t.isEmpty() ? null : t;
    }

    @Transactional(readOnly = true)
    public List<LeadDto> listAll(String assignedEmpId) {
        if (assignedEmpId == null || assignedEmpId.isBlank()) {
            return leadRepository.findAll().stream().map(this::toDto).toList();
        }
        return leadRepository.findByAssignedTo(assignedEmpId.trim()).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public LeadDto getById(Long id) {
        return leadRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found: " + id));
    }

    @Transactional
    public LeadDto reassignLead(Long leadId, ReassignLeadCommand command, String actorPrincipal) {
        String targetEmpId = command.newAssignedEmpId().trim();
        validateEmployeeExists(targetEmpId);
        Lead existing = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found: " + leadId));
        Instant now = Instant.now();
        Lead updated = new Lead(
                existing.id(),
                existing.leadCode(),
                existing.fullName(),
                existing.email(),
                existing.phone(),
                existing.company(),
                existing.leadSource(),
                existing.productInterested(),
                existing.budget(),
                existing.description(),
                existing.country(),
                existing.state(),
                existing.city(),
                existing.pincode(),
                existing.stage(),
                existing.priority(),
                targetEmpId,
                existing.expectedCloseDate(),
                existing.campaignId(),
                existing.createdAt(),
                now,
                existing.createdBy()
        );
        Lead saved = leadRepository.save(updated);

        LeadAssignmentHistoryEntity history = new LeadAssignmentHistoryEntity();
        history.setLeadId(saved.id());
        history.setFromEmpId(existing.assignedTo());
        history.setToEmpId(targetEmpId);
        history.setReason(blankToNull(command.reason()));
        history.setUnavailableFrom(command.unavailableFrom());
        history.setUnavailableTo(command.unavailableTo());
        history.setChangedBy(resolveActorEmployeeId(actorPrincipal));
        assignmentHistoryRepository.save(history);

        return toDto(saved);
    }

    private String resolveActorEmployeeId(String principal) {
        String fallback = principal == null || principal.isBlank() ? "SYSTEM" : principal.trim();
        return employeeRepository.findByEmailIgnoreCase(fallback)
                .map(EmployeeEntity::getEmployeeCode)
                .orElse(fallback);
    }

    private void validateEmployeeExists(String employeeCode) {
        employeeRepository.findByEmployeeCode(employeeCode)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeCode));
    }

    private LeadDto toDto(Lead lead) {
        return new LeadDto(
                lead.id(),
                lead.leadCode(),
                lead.fullName(),
                lead.email(),
                lead.phone(),
                lead.company(),
                lead.leadSource(),
                lead.productInterested(),
                lead.budget(),
                lead.description(),
                lead.country(),
                lead.state(),
                lead.city(),
                lead.pincode(),
                lead.stage(),
                lead.priority(),
                lead.assignedTo(),
                lead.expectedCloseDate(),
                lead.campaignId(),
                lead.createdAt(),
                lead.updatedAt(),
                lead.createdBy()
        );
    }

    public record ReassignLeadCommand(
            String newAssignedEmpId,
            String reason,
            LocalDate unavailableFrom,
            LocalDate unavailableTo
    ) {
    }
}
