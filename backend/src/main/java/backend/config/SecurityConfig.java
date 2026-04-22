package backend.config;

import backend.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(401, "Unauthorized");
                })
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/oauth2/**").permitAll()

                // Resource catalogue read access
                .requestMatchers(HttpMethod.GET, "/api/resources/**")
                    .hasAnyRole("ADMIN", "USER", "TECHNICIAN")

                // Resource management - ADMIN only
                .requestMatchers(HttpMethod.POST, "/api/resources/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/resources/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/resources/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/resources/**")
                    .hasRole("ADMIN")

                //  Allow public GET for individual booking (for QR verify page)
                .requestMatchers(HttpMethod.GET, "/api/bookings/*").permitAll()

                // Booking endpoints
                .requestMatchers("/api/bookings/**")
                    .hasAnyRole("USER", "ADMIN")

                // Existing role routes
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/technician/**").hasRole("TECHNICIAN")
                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN", "TECHNICIAN")

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

        config.setAllowedOrigins(List.of("http://localhost:3000","http://192.168.8.155:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}