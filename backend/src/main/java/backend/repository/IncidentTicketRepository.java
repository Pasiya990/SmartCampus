package backend.repository;

import backend.model.IncidentTicket;
import backend.model.TicketStatus;
import backend.model.PriorityLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {

    List<IncidentTicket> findByStatus(TicketStatus status);

    List<IncidentTicket> findByPriority(PriorityLevel priority);

    boolean existsByTicketCode(String ticketCode);
}