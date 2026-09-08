package in.careersetu.interviews.dto;

import java.time.Instant;
import java.util.UUID;

public class InterviewDtos {

    public record ScheduleInterviewRequest(
            UUID candidateId,
            String candidateName,
            String candidateEmail,
            String roleTitle,
            String round,
            String dateStr,
            String timeStr,
            Integer durationMinutes,
            String interviewerName,
            String meetingUrl,
            String notes
    ) {}

    public record UpdateInterviewStatusRequest(
            String status,
            String notes,
            Integer evaluationScore
    ) {}

    public record InterviewResponse(
            UUID id,
            UUID candidateId,
            String candidateName,
            String candidateEmail,
            UUID interviewerId,
            String interviewerName,
            String companyName,
            String roleTitle,
            String round,
            String dateStr,
            String timeStr,
            Instant scheduledAt,
            Integer durationMinutes,
            String meetingUrl,
            String status,
            String notes,
            Integer evaluationScore
    ) {}
}
