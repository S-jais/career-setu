package in.careersetu.messaging.controller;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.messaging.dto.MessageDtos;
import in.careersetu.messaging.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@Tag(name = "Messaging", description = "In-app messaging and candidate-recruiter chat threads")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/conversations")
    @Operation(summary = "Get user's active message conversations")
    public ResponseEntity<List<MessageDtos.ConversationSummary>> getConversations(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to view conversations.");
        }
        return ResponseEntity.ok(messageService.getUserConversations(principal.userId()));
    }

    @GetMapping("/thread/{conversationId}")
    @Operation(summary = "Get chat history messages for a conversation thread")
    public ResponseEntity<List<MessageDtos.MessageResponse>> getThread(
            @PathVariable String conversationId) {
        return ResponseEntity.ok(messageService.getConversationMessages(conversationId));
    }

    @PostMapping("/send")
    @Operation(summary = "Send a new chat message")
    public ResponseEntity<MessageDtos.MessageResponse> sendMessage(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody MessageDtos.SendMessageRequest req) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to send a message.");
        }
        return ResponseEntity.ok(messageService.sendMessage(principal.userId(), req));
    }

    @PatchMapping("/read/{conversationId}")
    @Operation(summary = "Mark messages in a conversation as read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable String conversationId,
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        if (principal == null) {
            throw CareerSetuException.unauthorized("Authentication required to update message read status.");
        }
        messageService.markAsRead(conversationId, principal.userId());
        return ResponseEntity.ok(Map.of("message", "Conversation marked as read"));
    }
}
