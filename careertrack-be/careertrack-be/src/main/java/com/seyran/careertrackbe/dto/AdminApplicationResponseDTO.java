package com.seyran.careertrackbe.dto;

import com.seyran.careertrackbe.model.enums.ApplicationStatus;
import com.seyran.careertrackbe.model.enums.WorkType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminApplicationResponseDTO {

    private Long id;
    private String companyName;
    private String position;
    private WorkType workType;
    private ApplicationStatus status;
    private UserSummaryDTO user;
}