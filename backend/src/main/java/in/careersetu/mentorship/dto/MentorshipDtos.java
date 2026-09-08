package in.careersetu.mentorship.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class MentorshipDtos {

    public record MentorResponse(
            UUID id,
            String name,
            String role,
            String company,
            Integer experienceYears,
            Double rating,
            Integer sessionsCount,
            String avatarInitials,
            String gradient,
            List<String> domains,
            String bio,
            String nextAvailable,
            List<String> languages,
            Integer hourlyRate
    ) {}

    public record BookSessionRequest(
            UUID mentorId,
            String scheduledTime,
            String topic,
            String goals,
            Integer durationMinutes
    ) {}

    public record MentorshipSessionResponse(
            UUID id,
            UUID mentorId,
            String mentorName,
            UUID studentId,
            String studentName,
            String scheduledTime,
            String topic,
            String goals,
            Integer durationMinutes,
            String status,
            String meetingLink,
            Instant createdAt
    ) {}
}
