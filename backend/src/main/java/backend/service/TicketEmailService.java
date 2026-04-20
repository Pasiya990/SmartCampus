package backend.service;

public interface TicketEmailService {
    void sendTicketAssignedEmail(String toEmail, String ticketCode, String title, String priority, String location);
}