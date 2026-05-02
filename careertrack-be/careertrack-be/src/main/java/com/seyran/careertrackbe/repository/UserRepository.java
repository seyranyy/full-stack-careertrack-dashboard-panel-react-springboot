package com.seyran.careertrackbe.repository;

import com.seyran.careertrackbe.model.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Bu arayüzün bir veritabanı deposu olduğunu Spring'e bildirir
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(@NotBlank(message = "Email is required")
                          @Email(message = "Please provide a valid email address") String email);
    // JpaRepository sayesinde save, findAll, delete gibi temel SQL işlemleri hazır gelir

    Optional<User> findByEmail(String email);
}