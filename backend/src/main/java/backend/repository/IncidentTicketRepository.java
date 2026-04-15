package backend.repository;

import backend.model.IncidentTicket;
import backend.model.PriorityLevel;
import backend.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {

    List<IncidentTicket> findByStatus(TicketStatus status);

    List<IncidentTicket> findByPriority(PriorityLevel priority);

    List<IncidentTicket> findByStatusAndPriority(TicketStatus status, PriorityLevel priority);

    Optional<IncidentTicket> findByTicketCode(String ticketCode);

    Optional<IncidentTicket> findTopByOrderByIdDesc();

    boolean existsByTicketCode(String ticketCode);

    
}