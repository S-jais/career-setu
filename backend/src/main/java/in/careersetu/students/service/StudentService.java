package in.careersetu.students.service;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.students.entity.StudentProfile;
import in.careersetu.students.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;

    public StudentService(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfile getProfileByUserId(UUID userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Create default empty profile if none exists
                    StudentProfile p = new StudentProfile();
                    p.setUserId(userId);
                    p.setProfileCompletionPct(20);
                    return studentProfileRepository.save(p);
                });
    }

    public StudentProfile updateProfile(UUID userId, StudentProfile updated) {
        StudentProfile existing = getProfileByUserId(userId);
        
        if (updated.getHeadline() != null) existing.setHeadline(updated.getHeadline());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        if (updated.getRollNumber() != null) existing.setRollNumber(updated.getRollNumber());
        if (updated.getCurrentYear() != null) existing.setCurrentYear(updated.getCurrentYear());
        if (updated.getCurrentSemester() != null) existing.setCurrentSemester(updated.getCurrentSemester());
        if (updated.getCgpa() != null) existing.setCgpa(updated.getCgpa());
        if (updated.getGraduationYear() != null) existing.setGraduationYear(updated.getGraduationYear());
        if (updated.getLinkedinUrl() != null) existing.setLinkedinUrl(updated.getLinkedinUrl());
        if (updated.getGithubUrl() != null) existing.setGithubUrl(updated.getGithubUrl());
        if (updated.getPortfolioUrl() != null) existing.setPortfolioUrl(updated.getPortfolioUrl());
        if (updated.getIsActivelyLooking() != null) existing.setIsActivelyLooking(updated.getIsActivelyLooking());
        
        // Calculate profile completion percentage dynamically
        int score = 30;
        if (existing.getHeadline() != null && !existing.getHeadline().isBlank()) score += 15;
        if (existing.getCgpa() != null) score += 15;
        if (existing.getGithubUrl() != null && !existing.getGithubUrl().isBlank()) score += 20;
        if (existing.getLinkedinUrl() != null && !existing.getLinkedinUrl().isBlank()) score += 20;
        existing.setProfileCompletionPct(score);

        return studentProfileRepository.save(existing);
    }
}
