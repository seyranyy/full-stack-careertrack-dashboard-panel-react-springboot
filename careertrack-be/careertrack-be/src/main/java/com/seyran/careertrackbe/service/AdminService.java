package com.seyran.careertrackbe.service;

import com.seyran.careertrackbe.dto.AdminApplicationResponseDTO;
import com.seyran.careertrackbe.dto.UserSummaryDTO;
import com.seyran.careertrackbe.model.entity.JobApplication;
import com.seyran.careertrackbe.model.entity.User;
import com.seyran.careertrackbe.model.enums.Role;
import com.seyran.careertrackbe.repository.JobApplicationRepository;
import com.seyran.careertrackbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.seyran.careertrackbe.dto.AdminCreateUserRequestDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    public List<UserSummaryDTO> getAllUsers(String adminEmail) {
        ensureAdmin(adminEmail);

        return userRepository.findAll()
                .stream()
                .map(this::mapToUserSummaryDTO)
                .toList();
    }

    public List<AdminApplicationResponseDTO> getAllApplications(String adminEmail) {
        ensureAdmin(adminEmail);

        return applicationRepository.findAll()
                .stream()
                .map(this::mapToAdminApplicationResponseDTO)
                .toList();
    }

    private void ensureAdmin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("You are not authorized to access admin resources!");
        }
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        return new UserSummaryDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    private AdminApplicationResponseDTO mapToAdminApplicationResponseDTO(JobApplication application) {
        User user = application.getUser();

        UserSummaryDTO userSummaryDTO = new UserSummaryDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return new AdminApplicationResponseDTO(
                application.getId(),
                application.getCompanyName(),
                application.getPosition(),
                application.getWorkType(),
                application.getStatus(),
                userSummaryDTO
        );
    }
    public UserSummaryDTO updateUserRole(Long userId, Role newRole, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found!"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("You are not authorized to manage user roles!");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (admin.getId().equals(targetUser.getId()) && newRole == Role.USER) {
            throw new RuntimeException("You cannot remove your own admin role!");
        }

        targetUser.setRole(newRole);

        User updatedUser = userRepository.save(targetUser);

        return mapToUserSummaryDTO(updatedUser);
    }
    public UserSummaryDTO createUser(AdminCreateUserRequestDTO request, String adminEmail) {
        ensureAdmin(adminEmail);

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        return mapToUserSummaryDTO(savedUser);
    }
}