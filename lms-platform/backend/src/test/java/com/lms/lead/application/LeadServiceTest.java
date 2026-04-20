package com.lms.lead.application;

import com.lms.lead.domain.Lead;
import com.lms.lead.domain.LeadRepository;
import com.lms.lead.domain.LeadStage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeadServiceTest {

    @Mock
    private LeadRepository leadRepository;

    @InjectMocks
    private LeadService leadService;

    @BeforeEach
    void setUp() {
        when(leadRepository.save(any())).thenAnswer(inv -> {
            Lead in = inv.getArgument(0);
            return new Lead(
                    5L,
                    in.leadCode() != null ? in.leadCode() : "LD5",
                    in.fullName(),
                    in.email(),
                    in.phone(),
                    in.company(),
                    in.leadSource(),
                    in.productInterested(),
                    in.budget(),
                    in.description(),
                    in.country(),
                    in.state(),
                    in.city(),
                    in.pincode(),
                    in.stage(),
                    in.priority(),
                    in.assignedTo(),
                    in.expectedCloseDate(),
                    in.campaignId(),
                    in.createdAt(),
                    in.updatedAt(),
                    in.createdBy()
            );
        });
    }

    private static CreateLeadCommand cmd(String fullName, String email, LeadStage status) {
        return new CreateLeadCommand(
                null,
                fullName,
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
                status,
                null,
                null,
                null,
                null
        );
    }

    @Test
    void create_persistsNewLeadWithStageNew() {
        CreateLeadCommand command = new CreateLeadCommand(
                null,
                "  Jane Doe ",
                "Jane@Example.com",
                " 555 ",
                "  Acme Inc ",
                " Campaign ",
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
        LeadDto dto = leadService.create(command);

        assertThat(dto.id()).isEqualTo(5L);
        assertThat(dto.fullName()).isEqualTo("Jane Doe");
        assertThat(dto.email()).isEqualTo("jane@example.com");
        assertThat(dto.phone()).isEqualTo("555");
        assertThat(dto.company()).isEqualTo("Acme Inc");
        assertThat(dto.leadSource()).isEqualTo("Campaign");
        assertThat(dto.stage()).isEqualTo(LeadStage.NEW);

        ArgumentCaptor<Lead> captor = ArgumentCaptor.forClass(Lead.class);
        verify(leadRepository).save(captor.capture());
        assertThat(captor.getValue().stage()).isEqualTo(LeadStage.NEW);
        assertThat(captor.getValue().id()).isNull();
    }

    @Test
    void create_usesProvidedStatus() {
        CreateLeadCommand c = cmd("Pat", "pat@x.com", LeadStage.QUALIFIED);
        LeadDto dto = leadService.create(c);
        assertThat(dto.stage()).isEqualTo(LeadStage.QUALIFIED);
        ArgumentCaptor<Lead> captor = ArgumentCaptor.forClass(Lead.class);
        verify(leadRepository).save(captor.capture());
        assertThat(captor.getValue().stage()).isEqualTo(LeadStage.QUALIFIED);
    }

    @Test
    void listAll_returnsDtos() {
        Instant now = Instant.parse("2024-01-01T00:00:00Z");
        when(leadRepository.findAll()).thenReturn(List.of(
                new Lead(1L, "LD1", "A", "a@b.com", "", null, null, null, null, null, null, null, null, null, LeadStage.NEW, null, null, null, null, now, now, "SYSTEM")
        ));

        List<LeadDto> list = leadService.listAll();
        assertThat(list).hasSize(1);
        assertThat(list.getFirst().fullName()).isEqualTo("A");
    }

    @Test
    void getById_throwsWhenMissing() {
        when(leadRepository.findById(9L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> leadService.getById(9L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("9");
    }
}
