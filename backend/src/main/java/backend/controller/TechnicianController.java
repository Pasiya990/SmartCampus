package backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/technician")
public class TechnicianController {

    @GetMapping("/test")
    public String technicianTest() {
        return "Hello TECHNICIAN";
    }
}