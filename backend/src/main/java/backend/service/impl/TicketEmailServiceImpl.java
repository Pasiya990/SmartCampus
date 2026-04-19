package backend.service.impl;

import backend.service.TicketEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketEmailServiceImpl implements TicketEmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendTicketAssignedEmail(String toEmail, String ticketCode, String title, String priority, String location) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("New Ticket Assigned - " + ticketCode);
        message.setText(
                "Hello,\n\n" +
                "A new ticket has been assigned to you.\n\n" +
                "Ticket Code: " + ticketCode + "\n" +
                "Title: " + title + "\n" +
                "Priority: " + priority + "\n" +
                "Location: " + location + "\n\n" +
                "Please log in to the system to view full details.\n\n" +
                "Thank you."
        );

        mailSender.send(message);
    }
}