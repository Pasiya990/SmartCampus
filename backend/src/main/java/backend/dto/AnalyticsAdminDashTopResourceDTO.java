package backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsAdminDashTopResourceDTO {

    private Long resourceId;
    private String resourceName;
    private String resourceType;
    private String location;
    private long bookingCount;
}