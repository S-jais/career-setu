package in.careersetu.applications.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ApplicationDtos {

    public record ApplyRequest(
            UUID opportunityId,
            String coverNote
    ) {}

    public record StudentApplicationResponse(
            UUID id,
            UUID opportunityId,
            String opportunityTitle,
            String companyName,
            String companyBrandName,
            String type,
            String workMode,
            String locationCity,
            String locationState,
            Integer stipendMin,
            Integer stipendMax,
            Integer salaryMin,
            Integer salaryMax,
            String status,
            String coverNote,
            BigDecimal matchScore,
            String aiExplanation,
            Instant appliedAt,
            Instant lastActivityAt
    ) {}

    public record OpportunityApplicantResponse(
            UUID id,
            UUID opportunityId,
            String opportunityTitle,
            UUID studentProfileId,
            String studentName,
            String studentEmail,
            String headline,
            Integer currentYear,
            BigDecimal cgpa,
            String status,
            String coverNote,
            BigDecimal matchScore,
            String aiExplanation,
            Instant appliedAt,
            Instant lastActivityAt
    ) {}
}
