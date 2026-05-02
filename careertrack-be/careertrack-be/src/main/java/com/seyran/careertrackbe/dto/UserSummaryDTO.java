package com.seyran.careertrackbe.dto;

import com.seyran.careertrackbe.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummaryDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
}