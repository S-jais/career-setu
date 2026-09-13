package in.careersetu.opportunities.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class OpportunityDtos {

    public record OpportunityResponse(
            UUID id,
            UUID companyId,
            UUID postedBy,
            String title,
            String slug,
            String type,
            String description,
            String locationCity,
            String locationState,
            String workMode,
            Integer stipendMin,
            Integer stipendMax,
            Integer salaryMin,
            Integer salaryMax,
            String currency,
            Boolean isPaid,
            Integer durationWeeks,
            LocalDate applicationDeadline,
            BigDecimal minCgpa,
            Integer openings,
            Integer applicationsCount,
            String status,
            Boolean isFeatured,
            Instant createdAt,
            String companyName
    ) {}

    public record CreateOpportunityRequest(
            String title,
            String type,
            String description,
            String locationCity,
            String locationState,
            String workMode,
            Integer stipendMin,
            Integer stipendMax,
            Integer salaryMin,
            Integer salaryMax,
            Integer openings,
            Integer durationWeeks,
            BigDecimal minCgpa,
            UUID companyId
    ) {}
}
