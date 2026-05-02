package com.seyran.careertrackbe.model.entity;

import com.seyran.careertrackbe.model.enums.ApplicationStatus;
import com.seyran.careertrackbe.model.enums.WorkType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Data
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String position;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Enumerated(EnumType.STRING)
    private WorkType workType;

    private LocalDate appliedDate;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    // Her başvuru bir kullanıcıya aittir.
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}