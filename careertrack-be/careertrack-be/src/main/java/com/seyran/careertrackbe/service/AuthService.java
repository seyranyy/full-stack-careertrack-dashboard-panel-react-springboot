package com.seyran.careertrackbe.service;

import com.seyran.careertrackbe.dto.AuthResponseDTO;
import com.seyran.careertrackbe.dto.LoginRequestDTO;
import com.seyran.careertrackbe.dto.RegisterRequestDTO;
import com.seyran.careertrackbe.model.entity.User;
import com.seyran.careertrackbe.model.enums.Role;
import com.seyran.careertrackbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequestDTO request) {
        // 1. Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // 2. Create new user entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // 3. Hash the password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 4. Set default role
        user.setRole(Role.USER);

        // 5. Save to database
        userRepository.save(user);

        return "User registered successfully!";
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponseDTO(token, user.getRole());
    }
}