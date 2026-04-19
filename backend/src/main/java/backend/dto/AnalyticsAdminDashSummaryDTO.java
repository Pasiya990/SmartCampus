package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsAdminDashSummaryDTO {

    private long totalResources;
    private long activeResources;
    private long outOfServiceResources;

    private long totalBookings;
    private long approvedBookings;
    private long pendingBookings;
    private long rejectedBookings;
    private long cancelledBookings;

    private long utilizedResources;
    private double approvalRate;
    private double averageApprovedBookingHours;
}