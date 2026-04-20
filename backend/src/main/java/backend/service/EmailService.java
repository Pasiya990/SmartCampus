package backend.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import backend.model.BookingResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendBookingApprovedEmail(String toEmail, 
                                         BookingResponse booking, 
                                         byte[] qrCodeBytes) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("✅ Booking Approved — " + booking.getResourceName());
        helper.setText(buildEmailBody(booking), true); // true = HTML

        // Attach QR code as inline image
        helper.addInline("qrcode", 
            new ByteArrayResource(qrCodeBytes), "image/png");

        mailSender.send(message);
    }

    private String buildEmailBody(BookingResponse booking) {
        return """
            <h2>Your Booking is Approved!</h2>
            <p><b>Resource:</b> %s</p>
            <p><b>Date:</b> %s</p>
            <p><b>Time:</b> %s – %s</p>
            <p><b>Purpose:</b> %s</p>
            <p><b>Attendees:</b> %d</p>
            <br/>
            <p>Show this QR code at the venue:</p>
            <img src="cid:qrcode" />
            """.formatted(
                booking.getResourceName(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getAttendees()
            );
    }
}