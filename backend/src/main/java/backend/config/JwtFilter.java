package backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
    
        String authHeader = request.getHeader("Authorization");
    
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
    
            String token = authHeader.substring(7);
    
            try {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);
    
                // 🔥 ONLY set auth if not already set
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
                            );
    
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
    
            } catch (Exception e) {
                // 🔥 CLEAR CONTEXT (IMPORTANT)
                SecurityContextHolder.clearContext();
                System.out.println("Invalid JWT: " + e.getMessage());
            }
        }
    
        filterChain.doFilter(request, response);
    }
}