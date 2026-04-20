package com.lms.lead.presentation;

import com.lms.common.api.ApiResponse;
import com.lms.lead.application.CreateLeadCommand;
import com.lms.lead.application.LeadDto;
import com.lms.lead.application.LeadService;
import com.lms.config.OpenApiConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
@Tag(name = "Leads", description = "Lead capture and listing")
@SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME_NAME)
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping
    @Operation(summary = "Create a lead")
    public ResponseEntity<ApiResponse<LeadResponse>> create(@Valid @RequestBody CreateLeadRequest request, Principal principal) {
        CreateLeadCommand cmd = request.toCommand();
        LeadDto created = leadService.create(cmd, principal != null ? principal.getName() : "SYSTEM");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(LeadResponse.from(created)));
    }

    @GetMapping
    @Operation(summary = "List leads")
    public ResponseEntity<ApiResponse<List<LeadResponse>>> list(@RequestParam(required = false) String assignedEmpId) {
        List<LeadResponse> body = leadService.listAll(assignedEmpId).stream().map(LeadResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(body));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lead by id")
    public ResponseEntity<ApiResponse<LeadResponse>> get(@PathVariable Long id) {
        LeadDto dto = leadService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(LeadResponse.from(dto)));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Reassign lead to another employee id")
    public ResponseEntity<ApiResponse<LeadResponse>> reassign(
            @PathVariable Long id,
            @Valid @RequestBody ReassignLeadRequest request,
            Principal principal
    ) {
        LeadService.ReassignLeadCommand cmd = new LeadService.ReassignLeadCommand(
                request.newAssignedEmpId(),
                request.reason(),
                request.unavailableFrom(),
                request.unavailableTo()
        );
        LeadDto dto = leadService.reassignLead(id, cmd, principal != null ? principal.getName() : "SYSTEM");
        return ResponseEntity.ok(ApiResponse.ok(LeadResponse.from(dto)));
    }

    public record ReassignLeadRequest(
            @NotBlank @Size(max = 40) String newAssignedEmpId,
            @Size(max = 255) String reason,
            LocalDate unavailableFrom,
            LocalDate unavailableTo
    ) {
    }
}
