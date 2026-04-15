package backend.config;

import backend.service.CustomOAuth2UserService;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
                .authorizeHttpRequests(auth -> auth
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
}