package com.seyran.careertrackbe.model.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.seyran.careertrackbe.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "app_users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING) // Veritabanına 0-1 değil, "ADMIN"/"USER" olarak yazar [cite: 183]
    private Role role;
}