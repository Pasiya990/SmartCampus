package backend.config;

import backend.service.CustomOAuth2UserService;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;



@Configuration
public class SecurityConfig {

    private final CustomOAuth2UserService oauthUserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final JwtFilter jwtFilter;

    // 🔥 THIS IS WHERE YOUR CODE GOES
    public SecurityConfig(CustomOAuth2UserService oauthUserService,
        OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
        JwtFilter jwtFilter) {
            this.oauthUserService = oauthUserService;
            this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
            this.jwtFilter = jwtFilter;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
            http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 🔥 ADD THIS
                .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔥 ADD THIS (MOST IMPORTANT)
                .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(401, "Unauthorized");
                    })
                )

                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/login").permitAll()
                    .requestMatchers("/oauth2/**").permitAll()
                    .requestMatchers("/admin/**").hasRole("ADMIN")
                    .requestMatchers("/technician/**").hasRole("TECHNICIAN")
                    .requestMatchers("/user/**").hasAnyRole("USER","ADMIN","TECHNICIAN")
                    .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                    .userInfoEndpoint(user -> user.userService(oauthUserService))
                    .successHandler(oAuth2LoginSuccessHandler)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
            return http.build();
        }
  
            @Bean
            public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration config = new CorsConfiguration();

            config.setAllowedOrigins(List.of("http://localhost:3000"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

            config.setAllowedHeaders(List.of(
               "Authorization",
               "Content-Type",
                "X-User-Id",
               "X-User-Role"
            ));

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", config);

            return source;
            }

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }


}