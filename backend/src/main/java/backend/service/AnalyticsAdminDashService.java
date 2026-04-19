package backend.service;

import backend.dto.AnalyticsAdminDashBusiestDayDTO;
import backend.dto.AnalyticsAdminDashOverviewDTO;
import backend.dto.AnalyticsAdminDashPeakHourDTO;
import backend.dto.AnalyticsAdminDashResourceTypeUsageDTO;
import backend.dto.AnalyticsAdminDashSummaryDTO;
import backend.dto.AnalyticsAdminDashTopResourceDTO;
import backend.model.Booking;
import backend.model.BookingStatus;
import backend.model.Resource;
import backend.repository.BookingRepository;
import backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsAdminDashService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public AnalyticsAdminDashOverviewDTO getDashboardOverview() {
        List<Resource> resources = resourceRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        AnalyticsAdminDashSummaryDTO summary = buildSummary(resources, bookings);

        return AnalyticsAdminDashOverviewDTO.builder()
                .summary(summary)
                .topResources(getTopResourcesInternal(bookings, 5))
                .peakHours(getPeakHoursInternal(bookings))
                .resourceTypeUsage(getResourceTypeUsageInternal(bookings))
                .busiestDays(getBusiestDaysInternal(bookings))
                .build();
    }

    public AnalyticsAdminDashSummaryDTO getSummary() {
        List<Resource> resources = resourceRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        return buildSummary(resources, bookings);
    }

    public List<AnalyticsAdminDashTopResourceDTO> getTopResources() {
        return getTopResourcesInternal(bookingRepository.findAll(), 5);
    }

    public List<AnalyticsAdminDashPeakHourDTO> getPeakHours() {
        return getPeakHoursInternal(bookingRepository.findAll());
    }

    public List<AnalyticsAdminDashResourceTypeUsageDTO> getResourceTypeUsage() {
        return getResourceTypeUsageInternal(bookingRepository.findAll());
    }

    public List<AnalyticsAdminDashBusiestDayDTO> getBusiestDays() {
        return getBusiestDaysInternal(bookingRepository.findAll());
    }

    private AnalyticsAdminDashSummaryDTO buildSummary(List<Resource> resources, List<Booking> bookings) {
        long totalResources = resources.size();

        long activeResources = resources.stream()
                .filter(r -> r.getStatus() == Resource.ResourceStatus.ACTIVE)
                .count();

        long outOfServiceResources = resources.stream()
                .filter(r -> r.getStatus() == Resource.ResourceStatus.OUT_OF_SERVICE)
                .count();

        long totalBookings = bookings.size();
        long approvedBookings = countByStatus(bookings, BookingStatus.APPROVED);
        long pendingBookings = countByStatus(bookings, BookingStatus.PENDING);
        long rejectedBookings = countByStatus(bookings, BookingStatus.REJECTED);
        long cancelledBookings = countByStatus(bookings, BookingStatus.CANCELLED);

        long utilizedResources = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.APPROVED)
                .map(b -> b.getResource().getId())
                .filter(Objects::nonNull)
                .distinct()
                .count();

        double approvalRate = totalBookings == 0
                ? 0.0
                : roundTwoDecimals((approvedBookings * 100.0) / totalBookings);

        double averageApprovedBookingHours = calculateAverageApprovedBookingHours(bookings);

        return AnalyticsAdminDashSummaryDTO.builder()
                .totalResources(totalResources)
                .activeResources(activeResources)
                .outOfServiceResources(outOfServiceResources)
                .totalBookings(totalBookings)
                .approvedBookings(approvedBookings)
                .pendingBookings(pendingBookings)
                .rejectedBookings(rejectedBookings)
                .cancelledBookings(cancelledBookings)
                .utilizedResources(utilizedResources)
                .approvalRate(approvalRate)
                .averageApprovedBookingHours(averageApprovedBookingHours)
                .build();
    }

    private List<AnalyticsAdminDashTopResourceDTO> getTopResourcesInternal(List<Booking> bookings, int limit) {
        Map<Resource, Long> grouped = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.APPROVED)
                .filter(b -> b.getResource() != null)
                .collect(Collectors.groupingBy(Booking::getResource, Collectors.counting()));

        return grouped.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(limit)
                .map(entry -> {
                    Resource resource = entry.getKey();
                    return AnalyticsAdminDashTopResourceDTO.builder()
                            .resourceId(resource.getId())
                            .resourceName(resource.getName())
                            .resourceType(resource.getType() != null ? resource.getType().name() : null)
                            .location(resource.getLocation())
                            .bookingCount(entry.getValue())
                            .build();
                })
                .toList();
    }

    private List<AnalyticsAdminDashPeakHourDTO> getPeakHoursInternal(List<Booking> bookings) {
        Map<Integer, Long> hourCounts = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.APPROVED)
                .filter(b -> b.getStartTime() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getStartTime().getHour(),
                        TreeMap::new,
                        Collectors.counting()
                ));

        return hourCounts.entrySet().stream()
                .map(entry -> AnalyticsAdminDashPeakHourDTO.builder()
                        .hour(entry.getKey())
                        .label(formatHourLabel(entry.getKey()))
                        .bookingCount(entry.getValue())
                        .build())
                .toList();
    }

    private List<AnalyticsAdminDashResourceTypeUsageDTO> getResourceTypeUsageInternal(List<Booking> bookings) {
        Map<String, Long> typeCounts = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.APPROVED)
                .filter(b -> b.getResource() != null && b.getResource().getType() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getResource().getType().name(),
                        Collectors.counting()
                ));

        return typeCounts.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .map(entry -> AnalyticsAdminDashResourceTypeUsageDTO.builder()
                        .resourceType(entry.getKey())
                        .bookingCount(entry.getValue())
                        .build())
                .toList();
    }

    private List<AnalyticsAdminDashBusiestDayDTO> getBusiestDaysInternal(List<Booking> bookings) {
        Map<DayOfWeek, Long> dayCounts = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.APPROVED)
                .filter(b -> b.getDate() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getDate().getDayOfWeek(),
                        () -> new EnumMap<>(DayOfWeek.class),
                        Collectors.counting()
                ));

        return Arrays.stream(DayOfWeek.values())
                .map(day -> AnalyticsAdminDashBusiestDayDTO.builder()
                        .dayName(formatDayName(day))
                        .orderIndex(day.getValue())
                        .bookingCount(dayCounts.getOrDefault(day, 0L))
                        .build())
                .toList();
    }

    private long countByStatus(List<Booking> bookings, BookingStatus status) {
        return bookings.stream()
                .filter(b -> b.getStatus() == status)
                .count();
    }

    private double calculateAverageApprovedBookingHours(List<Booking> bookings) {
        List<Booking> approved = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.APPROVED)
                .filter(b -> b.getStartTime() != null && b.getEndTime() != null)
                .toList();

        if (approved.isEmpty()) {
            return 0.0;
        }

        double totalHours = approved.stream()
                .mapToDouble(b -> Duration.between(b.getStartTime(), b.getEndTime()).toMinutes() / 60.0)
                .sum();

        return roundTwoDecimals(totalHours / approved.size());
    }

    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private String formatHourLabel(int hour) {
        int displayHour = (hour == 0 || hour == 12) ? 12 : hour % 12;
        String amPm = hour < 12 ? "AM" : "PM";
        return displayHour + ":00 " + amPm;
    }

    private String formatDayName(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "Monday";
            case TUESDAY -> "Tuesday";
            case WEDNESDAY -> "Wednesday";
            case THURSDAY -> "Thursday";
            case FRIDAY -> "Friday";
            case SATURDAY -> "Saturday";
            case SUNDAY -> "Sunday";
        };
    }
}