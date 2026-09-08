package in.careersetu.messaging.service;

import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.messaging.dto.MessageDtos;
import in.careersetu.messaging.entity.ChatMessage;
import in.careersetu.messaging.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public MessageService(ChatMessageRepository chatMessageRepository, UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MessageDtos.MessageResponse sendMessage(UUID senderId, MessageDtos.SendMessageRequest req) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        String conversationId = req.conversationId();
        if (conversationId == null || conversationId.isBlank()) {
            conversationId = generateConversationId(senderId, req.recipientId());
        }

        String senderName = sender.getFullName() != null ? sender.getFullName() : "User";
        String senderRole = req.senderRole() != null ? req.senderRole() : sender.getPrimaryRole().name();

        ChatMessage message = new ChatMessage(
                null,
                conversationId,
                senderId,
                senderName,
                senderRole,
                req.recipientId(),
                req.recipientName() != null ? req.recipientName() : "Recipient",
                req.content(),
                Instant.now(),
                false
        );

        ChatMessage saved = chatMessageRepository.save(message);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MessageDtos.MessageResponse> getConversationMessages(String conversationId) {
        return chatMessageRepository.findByConversationIdOrderBySentAtAsc(conversationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(String conversationId, UUID currentUserId) {
        List<ChatMessage> messages = chatMessageRepository.findByConversationIdOrderBySentAtAsc(conversationId);
        boolean changed = false;
        for (ChatMessage msg : messages) {
            if (msg.getRecipientId().equals(currentUserId) && !msg.getIsRead()) {
                msg.setIsRead(true);
                changed = true;
            }
        }
        if (changed) {
            chatMessageRepository.saveAll(messages);
        }
    }

    @Transactional(readOnly = true)
    public List<MessageDtos.ConversationSummary> getUserConversations(UUID userId) {
        List<String> conversationIds = chatMessageRepository.findConversationIdsForUser(userId);
        List<MessageDtos.ConversationSummary> summaries = new ArrayList<>();

        for (String cId : conversationIds) {
            List<ChatMessage> msgs = chatMessageRepository.findByConversationIdOrderBySentAtAsc(cId);
            if (msgs.isEmpty()) continue;

            ChatMessage lastMsg = msgs.get(msgs.size() - 1);
            long unread = msgs.stream()
                    .filter(m -> m.getRecipientId().equals(userId) && !m.getIsRead())
                    .count();

            // Find other party
            boolean isSender = lastMsg.getSenderId().equals(userId);
            String otherName = isSender ? lastMsg.getRecipientName() : lastMsg.getSenderName();
            UUID otherId = isSender ? lastMsg.getRecipientId() : lastMsg.getSenderId();
            String otherRole = isSender ? "RECIPIENT" : lastMsg.getSenderRole();

            List<MessageDtos.MessageResponse> mappedMsgs = msgs.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());

            summaries.add(new MessageDtos.ConversationSummary(
                    cId,
                    otherName,
                    otherRole,
                    otherId,
                    lastMsg.getContent(),
                    lastMsg.getSentAt(),
                    unread,
                    mappedMsgs
            ));
        }

        summaries.sort((a, b) -> b.lastMessageAt().compareTo(a.lastMessageAt()));
        return summaries;
    }

    public static String generateConversationId(UUID u1, UUID u2) {
        if (u1.compareTo(u2) < 0) {
            return "conv_" + u1 + "_" + u2;
        } else {
            return "conv_" + u2 + "_" + u1;
        }
    }

    private MessageDtos.MessageResponse mapToResponse(ChatMessage m) {
        return new MessageDtos.MessageResponse(
                m.getId(),
                m.getConversationId(),
                m.getSenderId(),
                m.getSenderName(),
                m.getSenderRole(),
                m.getRecipientId(),
                m.getRecipientName(),
                m.getContent(),
                m.getSentAt(),
                m.getIsRead()
        );
    }
}
