package com.lms.adminconfig.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "cfg_vertical_role_map", uniqueConstraints = {
        @UniqueConstraint(name = "uk_cfg_vertical_role", columnNames = {"vertical_id", "role_id"})
})
public class VerticalRoleMappingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vertical_id", nullable = false)
    private Long verticalId;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    public Long getId() {
        return id;
    }

    public Long getVerticalId() {
        return verticalId;
    }

    public void setVerticalId(Long verticalId) {
        this.verticalId = verticalId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
}
