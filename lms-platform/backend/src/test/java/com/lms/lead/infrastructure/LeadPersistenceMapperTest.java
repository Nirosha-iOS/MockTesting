package com.lms.lead.infrastructure;

import com.lms.lead.domain.Lead;
import com.lms.lead.domain.LeadStage;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class LeadPersistenceMapperTest {

    private final LeadPersistenceMapper mapper = new LeadPersistenceMapper();

    @Test
    void roundTrip_newLead() {
        Instant now = Instant.now();
        Lead domain = new Lead(
                null,
                null,
                "N",
                "n@e.com",
                "1",
                "Co",
                "WEB",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                LeadStage.NEW,
                null,
                null,
                null,
                null,
                now,
                now,
                "SYSTEM"
        );
        LeadEntity entity = mapper.toNewEntity(domain);
        assertThat(entity.getId()).isNull();
        assertThat(entity.getFullName()).isEqualTo("N");
        assertThat(entity.getCompany()).isEqualTo("Co");
        assertThat(entity.getLeadSource()).isEqualTo("WEB");

        entity.setId(10L);
        Lead back = mapper.toDomain(entity);
        assertThat(back.id()).isEqualTo(10L);
        assertThat(back.stage()).isEqualTo(LeadStage.NEW);
        assertThat(back.company()).isEqualTo("Co");
    }
}
