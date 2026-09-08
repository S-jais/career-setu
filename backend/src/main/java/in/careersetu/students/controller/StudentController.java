package in.careersetu.students.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.students.entity.StudentProfile;
import in.careersetu.students.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Students", description = "Student profiles, Career Passport, and onboarding")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current logged in student's profile")
    public ResponseEntity<StudentProfile> getMyProfile(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(studentService.getProfileByUserId(principal.userId()));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current logged in student's profile")
    public ResponseEntity<StudentProfile> updateMyProfile(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody StudentProfile profile) {
        return ResponseEntity.ok(studentService.updateProfile(principal.userId(), profile));
    }
}
