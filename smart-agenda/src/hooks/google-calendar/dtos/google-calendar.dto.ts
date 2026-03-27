export interface GoogleCalendarEvent {
  id: string
  title: string
  description?: string
  startDateTime: string
  endDateTime: string
  timeZone: string
  htmlLink?: string
}

export interface CreateEventDTO {
  title: string
  description?: string
  startDateTime: string
  endDateTime: string
  timeZone: string
}

export interface GoogleCalendarStatus {
  connected: boolean
  email?: string
}