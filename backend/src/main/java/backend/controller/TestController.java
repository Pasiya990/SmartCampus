package backend.controller;

import backend.model.Test;
import backend.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @Autowired
    private TestRepository repo;

    // ✅ Save data
    @PostMapping
    public Test save() {
        Test t = new Test("PostgreSQl connected");
        return repo.save(t);
    }

    // ✅ Get all data
    @GetMapping
    public List<Test> getAll() {
        return repo.findAll();
    }
}