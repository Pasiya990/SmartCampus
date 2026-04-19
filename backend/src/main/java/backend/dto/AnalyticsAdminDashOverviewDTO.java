package backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsAdminDashOverviewDTO {

    private AnalyticsAdminDashSummaryDTO summary;
    private List<AnalyticsAdminDashTopResourceDTO> topResources;
    private List<AnalyticsAdminDashPeakHourDTO> peakHours;
    private List<AnalyticsAdminDashResourceTypeUsageDTO> resourceTypeUsage;
    private List<AnalyticsAdminDashBusiestDayDTO> busiestDays;
}