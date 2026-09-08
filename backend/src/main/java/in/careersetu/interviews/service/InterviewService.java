package in.careersetu.interviews.service;

import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.interviews.dto.InterviewDtos;
import in.careersetu.interviews.entity.InterviewSchedule;
import in.careersetu.interviews.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;

    public InterviewService(InterviewRepository interviewRepository, UserRepository userRepository) {
        this.interviewRepository = interviewRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public InterviewDtos.InterviewResponse scheduleInterview(UUID interviewerId, InterviewDtos.ScheduleInterviewRequest req) {
        User interviewer = userRepository.findById(interviewerId)
                .orElseThrow(() -> new IllegalArgumentException("Interviewer not found"));

        String interviewerName = req.interviewerName() != null && !req.interviewerName().isBlank()
                ? req.interviewerName()
                : (interviewer.getFullName() != null ? interviewer.getFullName() : "Technical Interviewer");

        String meetingUrl = req.meetingUrl() != null && !req.meetingUrl().isBlank()
                ? req.meetingUrl()
                : "https://meet.google.com/cs-" + UUID.randomUUID().toString().substring(0, 8);

        InterviewSchedule schedule = new InterviewSchedule(
                null,
                req.candidateId(),
                req.candidateName(),
                req.candidateEmail(),
                interviewerId,
                interviewerName,
                "TechCorp India", // default company context
                req.roleTitle() != null ? req.roleTitle() : "Software Engineer",
                req.round() != null ? req.round() : "TECHNICAL_1",
                req.dateStr() != null ? req.dateStr() : "Upcoming",
                req.timeStr() != null ? req.timeStr() : "TBD",
                Instant.now(),
                req.durationMinutes() != null ? req.durationMinutes() : 45,
                meetingUrl,
                "SCHEDULED",
                req.notes(),
                null
        );

        InterviewSchedule saved = interviewRepository.save(schedule);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InterviewDtos.InterviewResponse> getAllInterviews() {
        return interviewRepository.findAllByOrderByScheduledAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewDtos.InterviewResponse> getInterviewsForCandidate(UUID candidateId) {
        return interviewRepository.findByCandidateIdOrderByScheduledAtDesc(candidateId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewDtos.InterviewResponse updateInterviewStatus(UUID id, InterviewDtos.UpdateInterviewStatusRequest req) {
        InterviewSchedule schedule = interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found: " + id));

        if (req.status() != null && !req.status().isBlank()) {
            schedule.setStatus(req.status());
        }
        if (req.notes() != null) {
            schedule.setNotes(req.notes());
        }
        if (req.evaluationScore() != null) {
            schedule.setEvaluationScore(req.evaluationScore());
        }

        InterviewSchedule saved = interviewRepository.save(schedule);
        return mapToResponse(saved);
    }

    private InterviewDtos.InterviewResponse mapToResponse(InterviewSchedule s) {
        return new InterviewDtos.InterviewResponse(
                s.getId(),
                s.getCandidateId(),
                s.getCandidateName(),
                s.getCandidateEmail(),
                s.getInterviewerId(),
                s.getInterviewerName(),
                s.getCompanyName(),
                s.getRoleTitle(),
                s.getRound(),
                s.getDateStr(),
                s.getTimeStr(),
                s.getScheduledAt(),
                s.getDurationMinutes(),
                s.getMeetingUrl(),
                s.getStatus(),
                s.getNotes(),
                s.getEvaluationScore()
        );
    }
}
