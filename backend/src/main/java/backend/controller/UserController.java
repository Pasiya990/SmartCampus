package backend.controller;


import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    

    @GetMapping("/hello")
    public String hello() {
        return "Hello USER";
    }

}