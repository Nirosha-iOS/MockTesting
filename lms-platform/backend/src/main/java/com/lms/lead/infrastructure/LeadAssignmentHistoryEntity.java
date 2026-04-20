package com.lms.lead.infrastructure;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "lead_assignment_history")
public class LeadAssignmentHistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_id", nullable = false)
    private Long leadId;

    @Column(name = "from_emp_id", length = 40)
    private String fromEmpId;

    @Column(name = "to_emp_id", nullable = false, length = 40)
    private String toEmpId;

    @Column(name = "reason", length = 255)
    private String reason;

    @Column(name = "unavailable_from")
    private LocalDate unavailableFrom;

    @Column(name = "unavailable_to")
    private LocalDate unavailableTo;

    @Column(name = "changed_by", nullable = false, length = 80)
    private String changedBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public String getFromEmpId() {
        return fromEmpId;
    }

    public void setFromEmpId(String fromEmpId) {
        this.fromEmpId = fromEmpId;
    }

    public String getToEmpId() {
        return toEmpId;
    }

    public void setToEmpId(String toEmpId) {
        this.toEmpId = toEmpId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDate getUnavailableFrom() {
        return unavailableFrom;
    }

    public void setUnavailableFrom(LocalDate unavailableFrom) {
        this.unavailableFrom = unavailableFrom;
    }

    public LocalDate getUnavailableTo() {
        return unavailableTo;
    }

    public void setUnavailableTo(LocalDate unavailableTo) {
        this.unavailableTo = unavailableTo;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }
}
