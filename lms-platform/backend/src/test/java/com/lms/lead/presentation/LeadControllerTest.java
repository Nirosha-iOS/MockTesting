package com.lms.lead.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.lead.application.CreateLeadCommand;
import com.lms.lead.application.LeadDto;
import com.lms.common.web.GlobalExceptionHandler;
import com.lms.lead.application.LeadService;
import com.lms.lead.domain.LeadStage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = LeadController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class LeadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LeadService leadService;

    private static CreateLeadRequest minimalCreate(String name, String email) {
        return new CreateLeadRequest(
                null,
                name,
                email,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }

    @Test
    void create_returns201() throws Exception {
        Instant now = Instant.parse("2024-06-01T12:00:00Z");
        when(leadService.create(any(CreateLeadCommand.class))).thenReturn(
                new LeadDto(1L, "LD1", "John", "john@x.com", "123", null, null, null, null, null, null, null, null, null, LeadStage.NEW, null, null, null, null, now, now, "SYSTEM")
        );

        String body = objectMapper.writeValueAsString(minimalCreate("John", "john@x.com"));

        mockMvc.perform(post("/api/v1/leads").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("John"));
    }

    @Test
    void create_validationError_returns400() throws Exception {
        String body = objectMapper.writeValueAsString(minimalCreate("", "not-an-email"));

        mockMvc.perform(post("/api/v1/leads").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void list_returns200() throws Exception {
        Instant now = Instant.now();
        when(leadService.listAll()).thenReturn(List.of(
                new LeadDto(2L, "LD2", "Mary", "m@x.com", "", null, null, null, null, null, null, null, null, null, LeadStage.NEW, null, null, null, null, now, now, "SYSTEM")
        ));

        mockMvc.perform(get("/api/v1/leads"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].email").value("m@x.com"));
    }
}
