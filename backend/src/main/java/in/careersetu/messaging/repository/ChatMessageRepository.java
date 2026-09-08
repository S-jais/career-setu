package in.careersetu.messaging.repository;

import in.careersetu.messaging.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByConversationIdOrderBySentAtAsc(String conversationId);

    @Query("SELECT DISTINCT m.conversationId FROM ChatMessage m WHERE m.senderId = :userId OR m.recipientId = :userId")
    List<String> findConversationIdsForUser(@Param("userId") UUID userId);
}
