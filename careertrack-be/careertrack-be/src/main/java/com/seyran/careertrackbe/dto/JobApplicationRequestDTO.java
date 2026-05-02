package com.seyran.careertrackbe.dto;

import com.seyran.careertrackbe.model.enums.ApplicationStatus;
import com.seyran.careertrackbe.model.enums.WorkType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobApplicationRequestDTO {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Position is required")
    private String position;

    @NotNull(message = "Work type is required")
    private WorkType workType;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;
}