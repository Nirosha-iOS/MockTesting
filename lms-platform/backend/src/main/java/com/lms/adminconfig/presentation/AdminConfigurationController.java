package com.lms.adminconfig.presentation;

import com.lms.adminconfig.entity.AttendanceConfigEntity;
import com.lms.adminconfig.entity.BulkUploadJobEntity;
import com.lms.adminconfig.entity.EmployeeEntity;
import com.lms.adminconfig.entity.ProductDocumentEntity;
import com.lms.adminconfig.entity.ProductEntity;
import com.lms.adminconfig.entity.ResourceLinkEntity;
import com.lms.adminconfig.entity.RoleEntity;
import com.lms.adminconfig.entity.RoleFunctionMappingEntity;
import com.lms.adminconfig.entity.VerticalEntity;
import com.lms.adminconfig.entity.VerticalRoleMappingEntity;
import com.lms.adminconfig.repository.AttendanceConfigRepository;
import com.lms.adminconfig.repository.BulkUploadJobRepository;
import com.lms.adminconfig.repository.EmployeeRepository;
import com.lms.adminconfig.repository.FunctionRepository;
import com.lms.adminconfig.repository.ProductDocumentRepository;
import com.lms.adminconfig.repository.ProductRepository;
import com.lms.adminconfig.repository.ResourceLinkRepository;
import com.lms.adminconfig.repository.RoleFunctionMappingRepository;
import com.lms.adminconfig.repository.RoleRepository;
import com.lms.adminconfig.repository.VerticalRepository;
import com.lms.adminconfig.repository.VerticalRoleMappingRepository;
import com.lms.common.api.ApiResponse;
import com.lms.config.OpenApiConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/config")
@Tag(name = "Admin Configuration", description = "CRUD and mapping APIs for admin setup modules")
@SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME_NAME)
public class AdminConfigurationController {
    private final EmployeeRepository employees;
    private final ProductRepository products;
    private final VerticalRepository verticals;
    private final RoleRepository roles;
    private final FunctionRepository functions;
    private final VerticalRoleMappingRepository verticalRoleMappings;
    private final RoleFunctionMappingRepository roleFunctionMappings;
    private final ProductDocumentRepository productDocuments;
    private final BulkUploadJobRepository bulkUploadJobs;
    private final ResourceLinkRepository links;
    private final AttendanceConfigRepository attendanceConfigs;

    public AdminConfigurationController(
            EmployeeRepository employees,
            ProductRepository products,
            VerticalRepository verticals,
            RoleRepository roles,
            FunctionRepository functions,
            VerticalRoleMappingRepository verticalRoleMappings,
            RoleFunctionMappingRepository roleFunctionMappings,
            ProductDocumentRepository productDocuments,
            BulkUploadJobRepository bulkUploadJobs,
            ResourceLinkRepository links,
            AttendanceConfigRepository attendanceConfigs
    ) {
        this.employees = employees;
        this.products = products;
        this.verticals = verticals;
        this.roles = roles;
        this.functions = functions;
        this.verticalRoleMappings = verticalRoleMappings;
        this.roleFunctionMappings = roleFunctionMappings;
        this.productDocuments = productDocuments;
        this.bulkUploadJobs = bulkUploadJobs;
        this.links = links;
        this.attendanceConfigs = attendanceConfigs;
    }

    @GetMapping("/employees")
    @Operation(summary = "List employees")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> listEmployees() {
        return ResponseEntity.ok(ApiResponse.ok(employees.findAll().stream().map(e ->
                new EmployeeResponse(
                        e.getId(),
                        e.getEmployeeCode(),
                        e.getName(),
                        e.getEmail(),
                        e.getPhone(),
                        e.getDepartment(),
                        e.getDesignation(),
                        e.getManagerEmpCode(),
                        e.getUnavailableFrom(),
                        e.getUnavailableTo(),
                        e.isActive()
                )).toList()));
    }

    @PostMapping("/employees")
    @Operation(summary = "Create employee")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody EmployeeRequest req) {
        EmployeeEntity e = new EmployeeEntity();
        e.setEmployeeCode(req.code().trim());
        e.setName(req.name().trim());
        e.setEmail(req.email().trim());
        e.setPhone(trimOrNull(req.phone()));
        e.setDepartment(trimOrNull(req.department()));
        e.setDesignation(trimOrNull(req.designation()));
        e.setManagerEmpCode(trimOrNull(req.managerEmpCode()));
        e.setUnavailableFrom(req.unavailableFrom());
        e.setUnavailableTo(req.unavailableTo());
        e.setActive(req.active());
        EmployeeEntity saved = employees.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new EmployeeResponse(
                        saved.getId(),
                        saved.getEmployeeCode(),
                        saved.getName(),
                        saved.getEmail(),
                        saved.getPhone(),
                        saved.getDepartment(),
                        saved.getDesignation(),
                        saved.getManagerEmpCode(),
                        saved.getUnavailableFrom(),
                        saved.getUnavailableTo(),
                        saved.isActive()
                )));
    }

    @PutMapping("/employees/{id}")
    @Operation(summary = "Update employee")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeRequest req) {
        EmployeeEntity e = required(employees, id, "Employee not found");
        e.setEmployeeCode(req.code().trim());
        e.setName(req.name().trim());
        e.setEmail(req.email().trim());
        e.setPhone(trimOrNull(req.phone()));
        e.setDepartment(trimOrNull(req.department()));
        e.setDesignation(trimOrNull(req.designation()));
        e.setManagerEmpCode(trimOrNull(req.managerEmpCode()));
        e.setUnavailableFrom(req.unavailableFrom());
        e.setUnavailableTo(req.unavailableTo());
        e.setActive(req.active());
        EmployeeEntity saved = employees.save(e);
        return ResponseEntity.ok(ApiResponse.ok(new EmployeeResponse(
                saved.getId(),
                saved.getEmployeeCode(),
                saved.getName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getDepartment(),
                saved.getDesignation(),
                saved.getManagerEmpCode(),
                saved.getUnavailableFrom(),
                saved.getUnavailableTo(),
                saved.isActive()
        )));
    }

    @GetMapping("/products")
    @Operation(summary = "List products")
    public ResponseEntity<ApiResponse<List<MasterResponse>>> listProducts() {
        return ResponseEntity.ok(ApiResponse.ok(products.findAll().stream()
                .map(p -> new MasterResponse(p.getId(), p.getCode(), p.getName(), p.isActive())).toList()));
    }

    @PostMapping("/products")
    @Operation(summary = "Create product")
    public ResponseEntity<ApiResponse<MasterResponse>> createProduct(@Valid @RequestBody MasterRequest req) {
        ProductEntity e = new ProductEntity();
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        ProductEntity saved = products.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update product")
    public ResponseEntity<ApiResponse<MasterResponse>> updateProduct(@PathVariable Long id, @Valid @RequestBody MasterRequest req) {
        ProductEntity e = required(products, id, "Product not found");
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        ProductEntity saved = products.save(e);
        return ResponseEntity.ok(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @GetMapping("/verticals")
    @Operation(summary = "List verticals")
    public ResponseEntity<ApiResponse<List<MasterResponse>>> listVerticals() {
        return ResponseEntity.ok(ApiResponse.ok(verticals.findAll().stream()
                .map(p -> new MasterResponse(p.getId(), p.getCode(), p.getName(), p.isActive())).toList()));
    }

    @PostMapping("/verticals")
    @Operation(summary = "Create vertical")
    public ResponseEntity<ApiResponse<MasterResponse>> createVertical(@Valid @RequestBody MasterRequest req) {
        VerticalEntity e = new VerticalEntity();
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        VerticalEntity saved = verticals.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @PutMapping("/verticals/{id}")
    @Operation(summary = "Update vertical")
    public ResponseEntity<ApiResponse<MasterResponse>> updateVertical(@PathVariable Long id, @Valid @RequestBody MasterRequest req) {
        VerticalEntity e = required(verticals, id, "Vertical not found");
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        VerticalEntity saved = verticals.save(e);
        return ResponseEntity.ok(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @GetMapping("/roles")
    @Operation(summary = "List roles")
    public ResponseEntity<ApiResponse<List<MasterResponse>>> listRoles() {
        return ResponseEntity.ok(ApiResponse.ok(roles.findAll().stream()
                .map(p -> new MasterResponse(p.getId(), p.getCode(), p.getName(), p.isActive())).toList()));
    }

    @PostMapping("/roles")
    @Operation(summary = "Create role")
    public ResponseEntity<ApiResponse<MasterResponse>> createRole(@Valid @RequestBody MasterRequest req) {
        RoleEntity e = new RoleEntity();
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        RoleEntity saved = roles.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @PutMapping("/roles/{id}")
    @Operation(summary = "Update role")
    public ResponseEntity<ApiResponse<MasterResponse>> updateRole(@PathVariable Long id, @Valid @RequestBody MasterRequest req) {
        RoleEntity e = required(roles, id, "Role not found");
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        RoleEntity saved = roles.save(e);
        return ResponseEntity.ok(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @GetMapping("/functions")
    @Operation(summary = "List functions")
    public ResponseEntity<ApiResponse<List<MasterResponse>>> listFunctions() {
        return ResponseEntity.ok(ApiResponse.ok(functions.findAll().stream()
                .map(p -> new MasterResponse(p.getId(), p.getCode(), p.getName(), p.isActive())).toList()));
    }

    @PostMapping("/functions")
    @Operation(summary = "Create function")
    public ResponseEntity<ApiResponse<MasterResponse>> createFunction(@Valid @RequestBody MasterRequest req) {
        com.lms.adminconfig.entity.FunctionEntity e = new com.lms.adminconfig.entity.FunctionEntity();
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        com.lms.adminconfig.entity.FunctionEntity saved = functions.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @PutMapping("/functions/{id}")
    @Operation(summary = "Update function")
    public ResponseEntity<ApiResponse<MasterResponse>> updateFunction(@PathVariable Long id, @Valid @RequestBody MasterRequest req) {
        com.lms.adminconfig.entity.FunctionEntity e = required(functions, id, "Function not found");
        e.setCode(req.code().trim());
        e.setName(req.name().trim());
        e.setActive(req.active());
        com.lms.adminconfig.entity.FunctionEntity saved = functions.save(e);
        return ResponseEntity.ok(ApiResponse.ok(new MasterResponse(saved.getId(), saved.getCode(), saved.getName(), saved.isActive())));
    }

    @GetMapping("/vertical-role-mappings")
    @Operation(summary = "List vertical-role mappings")
    public ResponseEntity<ApiResponse<List<VerticalRoleMappingResponse>>> listVerticalRoleMappings() {
        return ResponseEntity.ok(ApiResponse.ok(verticalRoleMappings.findAll().stream()
                .map(m -> new VerticalRoleMappingResponse(m.getId(), m.getVerticalId(), m.getRoleId())).toList()));
    }

    @PostMapping("/vertical-role-mappings")
    @Operation(summary = "Create vertical-role mapping")
    public ResponseEntity<ApiResponse<VerticalRoleMappingResponse>> createVerticalRoleMapping(@Valid @RequestBody VerticalRoleMappingRequest req) {
        required(verticals, req.verticalId(), "Vertical not found");
        required(roles, req.roleId(), "Role not found");
        VerticalRoleMappingEntity e = new VerticalRoleMappingEntity();
        e.setVerticalId(req.verticalId());
        e.setRoleId(req.roleId());
        VerticalRoleMappingEntity saved = verticalRoleMappings.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new VerticalRoleMappingResponse(saved.getId(), saved.getVerticalId(), saved.getRoleId())));
    }

    @DeleteMapping("/vertical-role-mappings/{id}")
    @Operation(summary = "Delete vertical-role mapping")
    public ResponseEntity<ApiResponse<Void>> deleteVerticalRoleMapping(@PathVariable Long id) {
        verticalRoleMappings.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/role-function-mappings")
    @Operation(summary = "List role-function mappings")
    public ResponseEntity<ApiResponse<List<RoleFunctionMappingResponse>>> listRoleFunctionMappings() {
        return ResponseEntity.ok(ApiResponse.ok(roleFunctionMappings.findAll().stream()
                .map(m -> new RoleFunctionMappingResponse(m.getId(), m.getRoleId(), m.getFunctionId())).toList()));
    }

    @PostMapping("/role-function-mappings")
    @Operation(summary = "Create role-function mapping")
    public ResponseEntity<ApiResponse<RoleFunctionMappingResponse>> createRoleFunctionMapping(@Valid @RequestBody RoleFunctionMappingRequest req) {
        required(roles, req.roleId(), "Role not found");
        required(functions, req.functionId(), "Function not found");
        RoleFunctionMappingEntity e = new RoleFunctionMappingEntity();
        e.setRoleId(req.roleId());
        e.setFunctionId(req.functionId());
        RoleFunctionMappingEntity saved = roleFunctionMappings.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new RoleFunctionMappingResponse(saved.getId(), saved.getRoleId(), saved.getFunctionId())));
    }

    @DeleteMapping("/role-function-mappings/{id}")
    @Operation(summary = "Delete role-function mapping")
    public ResponseEntity<ApiResponse<Void>> deleteRoleFunctionMapping(@PathVariable Long id) {
        roleFunctionMappings.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/product-documents")
    @Operation(summary = "List product documents")
    public ResponseEntity<ApiResponse<List<ProductDocumentResponse>>> listProductDocuments() {
        return ResponseEntity.ok(ApiResponse.ok(productDocuments.findAll().stream()
                .map(d -> new ProductDocumentResponse(d.getId(), d.getProductId(), d.getDocumentName(), d.getDocumentUrl(), d.getDocumentType())).toList()));
    }

    @PostMapping("/product-documents")
    @Operation(summary = "Create product document")
    public ResponseEntity<ApiResponse<ProductDocumentResponse>> createProductDocument(@Valid @RequestBody ProductDocumentRequest req) {
        required(products, req.productId(), "Product not found");
        ProductDocumentEntity d = new ProductDocumentEntity();
        d.setProductId(req.productId());
        d.setDocumentName(req.documentName().trim());
        d.setDocumentUrl(req.documentUrl().trim());
        d.setDocumentType(req.documentType() == null ? null : req.documentType().trim());
        ProductDocumentEntity saved = productDocuments.save(d);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new ProductDocumentResponse(saved.getId(), saved.getProductId(), saved.getDocumentName(), saved.getDocumentUrl(), saved.getDocumentType())));
    }

    @PutMapping("/product-documents/{id}")
    @Operation(summary = "Update product document")
    public ResponseEntity<ApiResponse<ProductDocumentResponse>> updateProductDocument(@PathVariable Long id, @Valid @RequestBody ProductDocumentRequest req) {
        required(products, req.productId(), "Product not found");
        ProductDocumentEntity d = required(productDocuments, id, "Product document not found");
        d.setProductId(req.productId());
        d.setDocumentName(req.documentName().trim());
        d.setDocumentUrl(req.documentUrl().trim());
        d.setDocumentType(req.documentType() == null ? null : req.documentType().trim());
        ProductDocumentEntity saved = productDocuments.save(d);
        return ResponseEntity.ok(ApiResponse.ok(new ProductDocumentResponse(saved.getId(), saved.getProductId(), saved.getDocumentName(), saved.getDocumentUrl(), saved.getDocumentType())));
    }

    @GetMapping("/bulk-upload-jobs")
    @Operation(summary = "List bulk upload jobs")
    public ResponseEntity<ApiResponse<List<BulkUploadJobResponse>>> listBulkUploadJobs() {
        return ResponseEntity.ok(ApiResponse.ok(bulkUploadJobs.findAll().stream().map(j ->
                new BulkUploadJobResponse(j.getId(), j.getFileName(), j.getFileType(), j.getStatus(), j.getTotalRows(), j.getSuccessRows(), j.getErrorRows(), j.getCreatedAt().toString())).toList()));
    }

    @PostMapping("/bulk-upload-jobs")
    @Operation(summary = "Create bulk upload job audit record")
    public ResponseEntity<ApiResponse<BulkUploadJobResponse>> createBulkUploadJob(@Valid @RequestBody BulkUploadJobRequest req) {
        BulkUploadJobEntity e = new BulkUploadJobEntity();
        e.setFileName(req.fileName().trim());
        e.setFileType(req.fileType().trim().toUpperCase());
        e.setStatus(req.status().trim().toUpperCase());
        e.setTotalRows(req.totalRows());
        e.setSuccessRows(req.successRows());
        e.setErrorRows(req.errorRows());
        BulkUploadJobEntity saved = bulkUploadJobs.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new BulkUploadJobResponse(saved.getId(), saved.getFileName(), saved.getFileType(), saved.getStatus(), saved.getTotalRows(), saved.getSuccessRows(), saved.getErrorRows(), saved.getCreatedAt().toString())));
    }

    @GetMapping("/links")
    @Operation(summary = "List links")
    public ResponseEntity<ApiResponse<List<ResourceLinkResponse>>> listLinks() {
        return ResponseEntity.ok(ApiResponse.ok(links.findAll().stream()
                .map(l -> new ResourceLinkResponse(l.getId(), l.getTitle(), l.getUrl(), l.getCategory(), l.isActive())).toList()));
    }

    @PostMapping("/links")
    @Operation(summary = "Create link")
    public ResponseEntity<ApiResponse<ResourceLinkResponse>> createLink(@Valid @RequestBody ResourceLinkRequest req) {
        ResourceLinkEntity e = new ResourceLinkEntity();
        e.setTitle(req.title().trim());
        e.setUrl(req.url().trim());
        e.setCategory(req.category() == null ? null : req.category().trim());
        e.setActive(req.active());
        ResourceLinkEntity saved = links.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new ResourceLinkResponse(saved.getId(), saved.getTitle(), saved.getUrl(), saved.getCategory(), saved.isActive())));
    }

    @PutMapping("/links/{id}")
    @Operation(summary = "Update link")
    public ResponseEntity<ApiResponse<ResourceLinkResponse>> updateLink(@PathVariable Long id, @Valid @RequestBody ResourceLinkRequest req) {
        ResourceLinkEntity e = required(links, id, "Link not found");
        e.setTitle(req.title().trim());
        e.setUrl(req.url().trim());
        e.setCategory(req.category() == null ? null : req.category().trim());
        e.setActive(req.active());
        ResourceLinkEntity saved = links.save(e);
        return ResponseEntity.ok(ApiResponse.ok(new ResourceLinkResponse(saved.getId(), saved.getTitle(), saved.getUrl(), saved.getCategory(), saved.isActive())));
    }

    @GetMapping("/attendance-configs")
    @Operation(summary = "List attendance configurations")
    public ResponseEntity<ApiResponse<List<AttendanceConfigResponse>>> listAttendanceConfigs() {
        return ResponseEntity.ok(ApiResponse.ok(attendanceConfigs.findAll().stream().map(a ->
                new AttendanceConfigResponse(a.getId(), a.getName(), a.getCheckInTime(), a.getCheckOutTime(), a.getGraceMinutes(), a.isActive())).toList()));
    }

    @PostMapping("/attendance-configs")
    @Operation(summary = "Create attendance configuration")
    public ResponseEntity<ApiResponse<AttendanceConfigResponse>> createAttendanceConfig(@Valid @RequestBody AttendanceConfigRequest req) {
        AttendanceConfigEntity a = new AttendanceConfigEntity();
        a.setName(req.name().trim());
        a.setCheckInTime(req.checkInTime());
        a.setCheckOutTime(req.checkOutTime());
        a.setGraceMinutes(req.graceMinutes());
        a.setActive(req.active());
        AttendanceConfigEntity saved = attendanceConfigs.save(a);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(new AttendanceConfigResponse(saved.getId(), saved.getName(), saved.getCheckInTime(), saved.getCheckOutTime(), saved.getGraceMinutes(), saved.isActive())));
    }

    @PutMapping("/attendance-configs/{id}")
    @Operation(summary = "Update attendance configuration")
    public ResponseEntity<ApiResponse<AttendanceConfigResponse>> updateAttendanceConfig(@PathVariable Long id, @Valid @RequestBody AttendanceConfigRequest req) {
        AttendanceConfigEntity a = required(attendanceConfigs, id, "Attendance configuration not found");
        a.setName(req.name().trim());
        a.setCheckInTime(req.checkInTime());
        a.setCheckOutTime(req.checkOutTime());
        a.setGraceMinutes(req.graceMinutes());
        a.setActive(req.active());
        AttendanceConfigEntity saved = attendanceConfigs.save(a);
        return ResponseEntity.ok(ApiResponse.ok(new AttendanceConfigResponse(saved.getId(), saved.getName(), saved.getCheckInTime(), saved.getCheckOutTime(), saved.getGraceMinutes(), saved.isActive())));
    }

    private static <T, ID> T required(JpaRepository<T, ID> repo, ID id, String msg) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException(msg));
    }

    private static String trimOrNull(String value) {
        if (value == null) return null;
        String t = value.trim();
        return t.isEmpty() ? null : t;
    }

    public record MasterRequest(
            @NotBlank @Size(max = 80) String code,
            @NotBlank @Size(max = 200) String name,
            boolean active
    ) {
    }

    public record EmployeeRequest(
            @NotBlank @Size(max = 40) String code,
            @NotBlank @Size(max = 200) String name,
            @NotBlank @Email @Size(max = 320) String email,
            @Size(max = 40) String phone,
            @Size(max = 120) String department,
            @Size(max = 120) String designation,
            @Size(max = 40) String managerEmpCode,
            LocalDate unavailableFrom,
            LocalDate unavailableTo,
            boolean active
    ) {
    }

    public record EmployeeResponse(
            Long id,
            String code,
            String name,
            String email,
            String phone,
            String department,
            String designation,
            String managerEmpCode,
            LocalDate unavailableFrom,
            LocalDate unavailableTo,
            boolean active
    ) {
    }

    public record MasterResponse(Long id, String code, String name, boolean active) {
    }

    public record VerticalRoleMappingRequest(@NotNull Long verticalId, @NotNull Long roleId) {
    }

    public record VerticalRoleMappingResponse(Long id, Long verticalId, Long roleId) {
    }

    public record RoleFunctionMappingRequest(@NotNull Long roleId, @NotNull Long functionId) {
    }

    public record RoleFunctionMappingResponse(Long id, Long roleId, Long functionId) {
    }

    public record ProductDocumentRequest(
            @NotNull Long productId,
            @NotBlank @Size(max = 200) String documentName,
            @NotBlank @Size(max = 1000) String documentUrl,
            @Size(max = 80) String documentType
    ) {
    }

    public record ProductDocumentResponse(Long id, Long productId, String documentName, String documentUrl, String documentType) {
    }

    public record BulkUploadJobRequest(
            @NotBlank @Size(max = 255) String fileName,
            @NotBlank @Size(max = 16) String fileType,
            @NotBlank @Size(max = 32) String status,
            @NotNull @Min(0) Integer totalRows,
            @NotNull @Min(0) Integer successRows,
            @NotNull @Min(0) Integer errorRows
    ) {
    }

    public record BulkUploadJobResponse(
            Long id,
            String fileName,
            String fileType,
            String status,
            Integer totalRows,
            Integer successRows,
            Integer errorRows,
            String createdAt
    ) {
    }

    public record ResourceLinkRequest(
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 1000) String url,
            @Size(max = 80) String category,
            boolean active
    ) {
    }

    public record ResourceLinkResponse(Long id, String title, String url, String category, boolean active) {
    }

    public record AttendanceConfigRequest(
            @NotBlank @Size(max = 120) String name,
            @NotNull LocalTime checkInTime,
            @NotNull LocalTime checkOutTime,
            @NotNull @Min(0) @Max(300) Integer graceMinutes,
            boolean active
    ) {
    }

    public record AttendanceConfigResponse(
            Long id,
            String name,
            LocalTime checkInTime,
            LocalTime checkOutTime,
            Integer graceMinutes,
            boolean active
    ) {
    }
}
