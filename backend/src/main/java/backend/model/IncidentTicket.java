package backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "incident_tickets",
        indexes = {
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_priority", columnList = "priority")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_code", unique = true)
    private String ticketCode;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PriorityLevel priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "resource_name")
    private String resourceName;

    @Column(name = "preferred_contact", nullable = false)
    private String preferredContact;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "reported_by", nullable = false)
    private String reportedBy;

    @Column(name = "assigned_technician")
    private String assignedTechnician;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "resolution_notes", length = 1000)
    private String resolutionNotes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TicketStatus.OPEN;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}