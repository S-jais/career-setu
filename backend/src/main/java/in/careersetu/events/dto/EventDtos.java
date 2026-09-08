package in.careersetu.events.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class EventDtos {

    public record EventResponse(
            UUID id,
            String title,
            String organizer,
            String category,
            String mode,
            String location,
            String startDate,
            String endDate,
            String registrationDeadline,
            String prizePool,
            Integer teamsCount,
            Integer maxTeamSize,
            List<String> tags,
            String description,
            List<String> perks,
            Boolean isRegistered
    ) {}

    public record RegisterEventRequest(
            String teamName
    ) {}

    public record EventRegistrationResponse(
            UUID id,
            UUID eventId,
            String eventTitle,
            UUID userId,
            String userName,
            String userEmail,
            String teamName,
            Instant registeredAt
    ) {}
}
