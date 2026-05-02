package com.seyran.careertrackbe.dto;

import com.seyran.careertrackbe.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Role role;
}