package backend.controller;

import backend.dto.AnalyticsAdminDashBusiestDayDTO;
import backend.dto.AnalyticsAdminDashOverviewDTO;
import backend.dto.AnalyticsAdminDashPeakHourDTO;
import backend.dto.AnalyticsAdminDashResourceTypeUsageDTO;
import backend.dto.AnalyticsAdminDashSummaryDTO;
import backend.dto.AnalyticsAdminDashTopResourceDTO;
import backend.service.AnalyticsAdminDashService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics-admin-dash")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsAdminDashController {

    private final AnalyticsAdminDashService analyticsAdminDashService;

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsAdminDashOverviewDTO> getOverview(Authentication authentication) {
        ensureAdmin(authentication);
        return ResponseEntity.ok(analyticsAdminDashService.getDashboardOverview());
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsAdminDashSummaryDTO> getSummary(Authentication authentication) {
        ensureAdmin(authentication);
        return ResponseEntity.ok(analyticsAdminDashService.getSummary());
    }

    @GetMapping("/top-resources")
    public ResponseEntity<List<AnalyticsAdminDashTopResourceDTO>> getTopResources(Authentication authentication) {
        ensureAdmin(authentication);
        return ResponseEntity.ok(analyticsAdminDashService.getTopResources());
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<List<AnalyticsAdminDashPeakHourDTO>> getPeakHours(Authentication authentication) {
        ensureAdmin(authentication);
        return ResponseEntity.ok(analyticsAdminDashService.getPeakHours());
    }

    @GetMapping("/resource-type-usage")
    public ResponseEntity<List<AnalyticsAdminDashResourceTypeUsageDTO>> getResourceTypeUsage(Authentication authentication) {
        ensureAdmin(authentication);
        return ResponseEntity.ok(analyticsAdminDashService.getResourceTypeUsage());
    }

    @GetMapping("/busiest-days")
    public ResponseEntity<List<AnalyticsAdminDashBusiestDayDTO>> getBusiestDays(Authentication authentication) {
        ensureAdmin(authentication);
        return ResponseEntity.ok(analyticsAdminDashService.getBusiestDays());
    }

    private void ensureAdmin(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can access dashboard analytics");
        }
    }
}