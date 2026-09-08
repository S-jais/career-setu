package in.careersetu.events.service;

import in.careersetu.events.dto.EventDtos;
import in.careersetu.events.entity.CampusEvent;
import in.careersetu.events.entity.EventRegistration;
import in.careersetu.events.repository.CampusEventRepository;
import in.careersetu.events.repository.EventRegistrationRepository;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CampusEventService {

    private final CampusEventRepository campusEventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;

    public CampusEventService(CampusEventRepository campusEventRepository,
                              EventRegistrationRepository eventRegistrationRepository,
                              UserRepository userRepository) {
        this.campusEventRepository = campusEventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<EventDtos.EventResponse> getEvents(UUID currentUserId) {
        List<CampusEvent> events = campusEventRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        Set<UUID> registeredEventIds = new HashSet<>();
        if (currentUserId != null) {
            List<EventRegistration> registrations = eventRegistrationRepository.findByUserIdOrderByRegisteredAtDesc(currentUserId);
            for (EventRegistration r : registrations) {
                registeredEventIds.add(r.getEventId());
            }
        }

        return events.stream()
                .map(e -> mapToResponse(e, registeredEventIds.contains(e.getId())))
                .collect(Collectors.toList());
    }

    @Transactional
    public EventDtos.EventRegistrationResponse registerForEvent(UUID userId, UUID eventId, EventDtos.RegisterEventRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        CampusEvent event = campusEventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));

        if (eventRegistrationRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new IllegalStateException("Already registered for this event");
        }

        String userName = user.getFullName() != null ? user.getFullName() : "Student Candidate";
        String teamName = req != null && req.teamName() != null && !req.teamName().isBlank()
                ? req.teamName()
                : userName + "'s Squad";

        EventRegistration reg = new EventRegistration(
                null,
                eventId,
                userId,
                userName,
                user.getEmail(),
                teamName,
                Instant.now()
        );

        event.setTeamsCount(event.getTeamsCount() + 1);
        campusEventRepository.save(event);

        EventRegistration saved = eventRegistrationRepository.save(reg);
        return new EventDtos.EventRegistrationResponse(
                saved.getId(),
                saved.getEventId(),
                event.getTitle(),
                saved.getUserId(),
                saved.getUserName(),
                saved.getUserEmail(),
                saved.getTeamName(),
                saved.getRegisteredAt()
        );
    }

    @Transactional(readOnly = true)
    public List<EventDtos.EventRegistrationResponse> getMyRegistrations(UUID userId) {
        List<EventRegistration> registrations = eventRegistrationRepository.findByUserIdOrderByRegisteredAtDesc(userId);
        List<EventDtos.EventRegistrationResponse> responses = new ArrayList<>();

        for (EventRegistration r : registrations) {
            String title = campusEventRepository.findById(r.getEventId())
                    .map(CampusEvent::getTitle)
                    .orElse("Campus Event");

            responses.add(new EventDtos.EventRegistrationResponse(
                    r.getId(),
                    r.getEventId(),
                    title,
                    r.getUserId(),
                    r.getUserName(),
                    r.getUserEmail(),
                    r.getTeamName(),
                    r.getRegisteredAt()
            ));
        }
        return responses;
    }

    private EventDtos.EventResponse mapToResponse(CampusEvent e, boolean isRegistered) {
        List<String> tags = e.getTags() != null && !e.getTags().isBlank()
                ? Arrays.asList(e.getTags().split("\\s*,\\s*"))
                : Collections.emptyList();

        List<String> perks = e.getPerks() != null && !e.getPerks().isBlank()
                ? Arrays.asList(e.getPerks().split("\\s*;\\s*"))
                : Collections.emptyList();

        return new EventDtos.EventResponse(
                e.getId(),
                e.getTitle(),
                e.getOrganizer(),
                e.getCategory(),
                e.getMode(),
                e.getLocation(),
                e.getStartDate(),
                e.getEndDate(),
                e.getRegistrationDeadline(),
                e.getPrizePool(),
                e.getTeamsCount(),
                e.getMaxTeamSize(),
                tags,
                e.getDescription(),
                perks,
                isRegistered
        );
    }
}
