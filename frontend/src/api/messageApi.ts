import { apiClient } from './apiClient'

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: string
  recipientId: string
  recipientName: string
  content: string
  sentAt: string
  isRead: boolean
}

export interface ConversationSummary {
  conversationId: string
  otherPartyName: string
  otherPartyRole: string
  otherPartyId: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  recentMessages: ChatMessage[]
}

export interface SendMessagePayload {
  conversationId?: string
  recipientId: string
  recipientName?: string
  content: string
  senderRole?: string
}

export const messageApi = {
  async getConversations(): Promise<ConversationSummary[]> {
    const { data } = await apiClient.get<ConversationSummary[]>('/messages/conversations')
    return data
  },

  async getThread(conversationId: string): Promise<ChatMessage[]> {
    const { data } = await apiClient.get<ChatMessage[]>(`/messages/thread/${conversationId}`)
    return data
  },

  async sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    const { data } = await apiClient.post<ChatMessage>('/messages/send', payload)
    return data
  },

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.patch(`/messages/read/${conversationId}`)
  }
}
