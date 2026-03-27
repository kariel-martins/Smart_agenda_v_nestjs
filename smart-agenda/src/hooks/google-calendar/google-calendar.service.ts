
import { axiosInstance } from "@/lib/axios"
import type { CreateEventDTO, GoogleCalendarEvent, GoogleCalendarStatus } from "./dtos/google-calendar.dto"

export class GoogleCalendarService {

  async getStatus(): Promise<GoogleCalendarStatus> {
    const { data } = await axiosInstance.get("/google-calendar/status")
    return data
  }

  async listEvents(): Promise<GoogleCalendarEvent[]> {
    const { data } = await axiosInstance.get("/google-calendar/events")
    return data
  }

  async createEvent(body: CreateEventDTO): Promise<GoogleCalendarEvent> {
    const { data } = await axiosInstance.post("/google-calendar/events", body)
    return data
  }

  async deleteEvent(eventId: string): Promise<void> {
    await axiosInstance.delete(`/google-calendar/events/${eventId}`)
  }

  async connect(): Promise<void> {
  const { data } = await axiosInstance.get("/google-calendar/auth-url")
  window.location.href = data.url
}

  async disconnect(): Promise<void> {
    await axiosInstance.delete("/google-calendar/disconnect")
  }
}