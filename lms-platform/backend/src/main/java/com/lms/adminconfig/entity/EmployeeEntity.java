package com.lms.adminconfig.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "cfg_employees")
public class EmployeeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", nullable = false, unique = true, length = 40)
    private String employeeCode;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(length = 40)
    private String phone;

    @Column(length = 120)
    private String department;

    @Column(length = 120)
    private String designation;

    @Column(name = "manager_emp_code", length = 40)
    private String managerEmpCode;

    @Column(name = "unavailable_from")
    private LocalDate unavailableFrom;

    @Column(name = "unavailable_to")
    private LocalDate unavailableTo;

    @Column(nullable = false)
    private boolean active = true;

    public Long getId() {
        return id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getManagerEmpCode() {
        return managerEmpCode;
    }

    public void setManagerEmpCode(String managerEmpCode) {
        this.managerEmpCode = managerEmpCode;
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
}
