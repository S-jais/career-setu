package in.careersetu.messaging.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class MessageDtos {

    public record SendMessageRequest(
            String conversationId,
            UUID recipientId,
            String recipientName,
            String content,
            String senderRole
    ) {}

    public record MessageResponse(
            UUID id,
            String conversationId,
            UUID senderId,
            String senderName,
            String senderRole,
            UUID recipientId,
            String recipientName,
            String content,
            Instant sentAt,
            Boolean isRead
    ) {}

    public record ConversationSummary(
            String conversationId,
            String otherPartyName,
            String otherPartyRole,
            UUID otherPartyId,
            String lastMessage,
            Instant lastMessageAt,
            long unreadCount,
            List<MessageResponse> recentMessages
    ) {}
}
