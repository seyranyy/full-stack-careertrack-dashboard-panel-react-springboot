package com.seyran.careertrackbe.controller;

import com.seyran.careertrackbe.dto.AdminApplicationResponseDTO;
import com.seyran.careertrackbe.dto.UserSummaryDTO;
import com.seyran.careertrackbe.model.enums.Role;
import com.seyran.careertrackbe.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.seyran.careertrackbe.dto.AdminCreateUserRequestDTO;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> getAllUsers(Authentication authentication) {
        String adminEmail = authentication.getName();

        List<UserSummaryDTO> users = adminService.getAllUsers(adminEmail);

        return ResponseEntity.ok(users);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<AdminApplicationResponseDTO>> getAllApplications(Authentication authentication) {
        String adminEmail = authentication.getName();

        List<AdminApplicationResponseDTO> applications =
                adminService.getAllApplications(adminEmail);

        return ResponseEntity.ok(applications);
    }
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserSummaryDTO> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        UserSummaryDTO updatedUser =
                adminService.updateUserRole(userId, role, adminEmail);

        return ResponseEntity.ok(updatedUser);
    }
    @PostMapping("/users")
    public ResponseEntity<UserSummaryDTO> createUser(
            @Valid @RequestBody AdminCreateUserRequestDTO request,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        UserSummaryDTO createdUser = adminService.createUser(request, adminEmail);

        return ResponseEntity.ok(createdUser);
    }
}