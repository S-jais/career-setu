package in.careersetu.mentorship.service;

import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.mentorship.dto.MentorshipDtos;
import in.careersetu.mentorship.entity.MentorProfile;
import in.careersetu.mentorship.entity.MentorshipSession;
import in.careersetu.mentorship.repository.MentorProfileRepository;
import in.careersetu.mentorship.repository.MentorshipSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MentorService {

    private final MentorProfileRepository mentorProfileRepository;
    private final MentorshipSessionRepository mentorshipSessionRepository;
    private final UserRepository userRepository;

    public MentorService(MentorProfileRepository mentorProfileRepository,
                         MentorshipSessionRepository mentorshipSessionRepository,
                         UserRepository userRepository) {
        this.mentorProfileRepository = mentorProfileRepository;
        this.mentorshipSessionRepository = mentorshipSessionRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<MentorshipDtos.MentorResponse> getMentors(String query) {
        List<MentorProfile> mentors;
        if (query != null && !query.isBlank()) {
            mentors = mentorProfileRepository.searchMentors(query.trim());
        } else {
            mentors = mentorProfileRepository.findByIsActiveTrue();
        }
        return mentors.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public MentorshipDtos.MentorshipSessionResponse bookSession(UUID studentId, MentorshipDtos.BookSessionRequest req) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        MentorProfile mentor = mentorProfileRepository.findById(req.mentorId())
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found: " + req.mentorId()));

        String studentName = student.getFullName() != null ? student.getFullName() : "Student";
        String meetingLink = "https://meet.google.com/cs-mentor-" + UUID.randomUUID().toString().substring(0, 8);

        MentorshipSession session = new MentorshipSession(
                null,
                mentor.getId(),
                mentor.getFullName(),
                studentId,
                studentName,
                req.scheduledTime() != null ? req.scheduledTime() : "Upcoming",
                req.topic() != null ? req.topic() : "Career & Technical Guidance",
                req.goals(),
                req.durationMinutes() != null ? req.durationMinutes() : 45,
                "CONFIRMED",
                meetingLink
        );

        mentor.setSessionsCount(mentor.getSessionsCount() + 1);
        mentorProfileRepository.save(mentor);

        MentorshipSession saved = mentorshipSessionRepository.save(session);
        return mapToSessionResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MentorshipDtos.MentorshipSessionResponse> getStudentSessions(UUID studentId) {
        return mentorshipSessionRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    private MentorshipDtos.MentorResponse mapToResponse(MentorProfile m) {
        List<String> domains = m.getDomains() != null && !m.getDomains().isBlank()
                ? Arrays.asList(m.getDomains().split("\\s*,\\s*"))
                : Collections.emptyList();

        List<String> languages = m.getLanguages() != null && !m.getLanguages().isBlank()
                ? Arrays.asList(m.getLanguages().split("\\s*,\\s*"))
                : List.of("English", "Hindi");

        return new MentorshipDtos.MentorResponse(
                m.getId(),
                m.getFullName(),
                m.getRoleTitle(),
                m.getCompany(),
                m.getExperienceYears(),
                m.getRating(),
                m.getSessionsCount(),
                m.getAvatarInitials(),
                m.getGradient(),
                domains,
                m.getBio(),
                m.getNextAvailable(),
                languages,
                m.getHourlyRate()
        );
    }

    private MentorshipDtos.MentorshipSessionResponse mapToSessionResponse(MentorshipSession s) {
        return new MentorshipDtos.MentorshipSessionResponse(
                s.getId(),
                s.getMentorId(),
                s.getMentorName(),
                s.getStudentId(),
                s.getStudentName(),
                s.getScheduledTime(),
                s.getTopic(),
                s.getGoals(),
                s.getDurationMinutes(),
                s.getStatus(),
                s.getMeetingLink(),
                s.getCreatedAt()
        );
    }
}
