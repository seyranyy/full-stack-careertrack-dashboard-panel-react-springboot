package com.seyran.careertrackbe.controller;

import com.seyran.careertrackbe.dto.JobApplicationRequestDTO;
import com.seyran.careertrackbe.model.entity.JobApplication;
import com.seyran.careertrackbe.model.enums.ApplicationStatus;
import com.seyran.careertrackbe.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping
    public ResponseEntity<JobApplication> createApplication(
            @Valid @RequestBody JobApplicationRequestDTO request,
            Authentication authentication // Spring Security'nin bize sunduğu, kimlik kartını okuyan parametre
    ) {
        // 1. Gümrük memurunun (Filtre) okuduğu e-posta adresini Token'dan alıyoruz
        String userEmail = authentication.getName();

        // 2. Servise "Al bu formu, şu e-postalı kişi için kaydet" diyoruz
        JobApplication savedApplication = applicationService.createApplication(request, userEmail);

        return ResponseEntity.ok(savedApplication);
    }
    // 1. LİSTELEME KAPISI
    @GetMapping
    public ResponseEntity<List<JobApplication>> getUserApplications(Authentication authentication) {
        String userEmail = authentication.getName();
        List<JobApplication> applications = applicationService.getUserApplications(userEmail);
        return ResponseEntity.ok(applications);
    }

    // 2. GÜNCELLEME KAPISI (Sadece statüyü güncelleyeceğiz)
    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        JobApplication updatedApplication = applicationService.updateApplicationStatus(id, status, userEmail);
        return ResponseEntity.ok(updatedApplication);
    }

    // 3. SİLME KAPISI
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        applicationService.deleteApplication(id, userEmail);
        return ResponseEntity.ok("Application successfully deleted!");
    }
    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequestDTO request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        JobApplication updatedApplication =
                applicationService.updateApplication(id, request, userEmail);

        return ResponseEntity.ok(updatedApplication);
    }
}