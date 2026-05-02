package com.seyran.careertrackbe.config;

import com.seyran.careertrackbe.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Frontend'den gelen cross-origin request'lere izin ver
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // JWT kullandığımız için CSRF kapalı
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // Browser'ın POST/PUT/DELETE öncesi attığı preflight request serbest olmalı
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth endpointleri herkese açık
                        .requestMatchers("/api/auth/**").permitAll()
                        // Swagger/OpenAPI herkese açık
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Diğer tüm endpointler token ister
                        .anyRequest().authenticated()
                )

                // Backend session tutmayacak, her request token ile doğrulanacak
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // JWT filtremiz Spring Security'nin username/password filtresinden önce çalışacak
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Development için tüm localhost portlarına izin veriyoruz:
        // örn: http://localhost:5173, 5177, 5178
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*"));

        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        // Frontend hangi header'ı gönderirse göndersin development'ta izin ver
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Frontend response içinden Authorization header'ını okuyabilsin
        configuration.setExposedHeaders(Arrays.asList("Authorization","Content-Type","Accept"));

        // Cookie/token gibi credential bilgilerine izin verir
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Tüm endpointler için CORS ayarını uygula
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}