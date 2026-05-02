package com.seyran.careertrackbe.repository;

import com.seyran.careertrackbe.model.entity.JobApplication;
import com.seyran.careertrackbe.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Arşiv görevlisine özel talimat:
    // "Bana sadece bu kullanıcı ID'sine (mühre) sahip olan başvuruları getir."
    List<JobApplication> findByUserId(Long userId);
    List<JobApplication> findByUserOrderByCreatedAtDesc(User user);
}