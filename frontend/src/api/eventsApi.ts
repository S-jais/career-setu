import { apiClient } from './apiClient'

export interface CampusEventData {
  id: string
  title: string
  organizer: string
  category: 'HACKATHON' | 'HIRING_SPRINT' | 'WORKSHOP' | 'COMPETITION' | string
  mode: 'ONLINE' | 'HYBRID' | 'IN_PERSON' | string
  location: string
  startDate: string
  endDate: string
  registrationDeadline: string
  prizePool: string
  teamsCount: number
  maxTeamSize: number
  tags: string[]
  description: string
  perks: string[]
  isRegistered?: boolean
}

export interface RegisterEventPayload {
  teamName?: string
}

export interface EventRegistrationRecord {
  id: string
  eventId: string
  eventTitle: string
  userId: string
  userName: string
  userEmail: string
  teamName: string
  registeredAt: string
}

export const eventsApi = {
  async getEvents(): Promise<CampusEventData[]> {
    const { data } = await apiClient.get<CampusEventData[]>('/events')
    return data
  },

  async registerForEvent(eventId: string, payload: RegisterEventPayload): Promise<EventRegistrationRecord> {
    const { data } = await apiClient.post<EventRegistrationRecord>(`/events/${eventId}/register`, payload)
    return data
  },

  async getMyRegistrations(): Promise<EventRegistrationRecord[]> {
    const { data } = await apiClient.get<EventRegistrationRecord[]>('/events/my-registrations')
    return data
  }
}
