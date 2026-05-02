package com.seyran.careertrackbe.service;

import com.seyran.careertrackbe.dto.JobApplicationRequestDTO;
import com.seyran.careertrackbe.model.entity.JobApplication;
import com.seyran.careertrackbe.model.entity.User;
import com.seyran.careertrackbe.model.enums.ApplicationStatus;
import com.seyran.careertrackbe.repository.JobApplicationRepository;
import com.seyran.careertrackbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    // Başvuru Ekleme Metodu
    public JobApplication createApplication(JobApplicationRequestDTO request, String userEmail) {

        // 1.User veritabanından bul
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. Boş formdaki (DTO) bilgileri Entitye aktar
        JobApplication application = new JobApplication();
        application.setCompanyName(request.getCompanyName());
        application.setPosition(request.getPosition());
        application.setWorkType(request.getWorkType());

        // 3. Otomatik doldurulacak alanlar
        application.setStatus(ApplicationStatus.PENDING); // İlk eklendiğinde "Bekliyor" olur
        application.setAppliedDate(LocalDate.now()); // Başvuru tarihi otomatik olarak "bugün" atanır

        // 4. Bu başvuru bu kullanıcıya aittir
        application.setUser(user);

        // 5.teslim et ve kaydet
        return applicationRepository.save(application);
    }
     // 1.list : Sadece giriş yapan kullanıcının başvurularını getir
    public List<JobApplication> getUserApplications(String userEmail){
        User user= userRepository.findByEmail(userEmail)
                .orElseThrow(()->new RuntimeException("User not found!"));
        return applicationRepository.findByUserId(user.getId());
     }
    //2. Update :Başvurunun durumunu (PENDING, ACCEPTED vb.) değiştir
    public JobApplication updateApplicationStatus(Long id, ApplicationStatus newStatus, String userEmail) {
        // Önce başvuru veritabanında var mı diye bak
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        // GÜVENLİK: Bu başvuru gerçekten isteği atan kişiye mi ait? Başkasının verisi değiştirilemesin!
        if (!application.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to update this application!");
        }

        application.setStatus(newStatus);
        return applicationRepository.save(application);
    }

    // 3. SİLME (DELETE): Başvuruyu tamamen sil
    public void deleteApplication(Long id, String userEmail) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        // GÜVENLİK: Kendi başvurusu mu kontrol et
        if (!userEmail.equals(application.getUser().getEmail())) {
            throw new RuntimeException("You are not authorized to delete this application!");
        }

        applicationRepository.delete(application);
    }

    public JobApplication updateApplication(Long id, JobApplicationRequestDTO request, String userEmail) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        if (!userEmail.equals(application.getUser().getEmail())) {
            throw new RuntimeException("You are not authorized to update this application!");
        }

        application.setCompanyName(request.getCompanyName());
        application.setPosition(request.getPosition());
        application.setWorkType(request.getWorkType());
        application.setStatus(request.getStatus());

        return applicationRepository.save(application);
    }


}