package backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/test")
    public String adminTest() {
        return "Hello ADMIN";
    }
}