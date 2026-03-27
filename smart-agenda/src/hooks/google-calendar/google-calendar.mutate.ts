import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GoogleCalendarService } from "./google-calendar.service"
import type { CreateEventDTO } from "./dtos/google-calendar.dto"

const service = new GoogleCalendarService()

// Status da conexão (connected + email)
export function useGoogleCalendarStatus() {
  return useQuery({
    queryKey: ["google-calendar", "status"],
    queryFn: () => service.getStatus(),
  })
}

// Lista de eventos
export function useGoogleCalendarEvents() {
  return useQuery({
    queryKey: ["google-calendar", "events"],
    queryFn: () => service.listEvents(),
  })
}

// Criar evento
export function useGoogleCalendarEventCreate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateEventDTO) => service.createEvent(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar", "events"] })
    },
  })
}

// Deletar evento
export function useGoogleCalendarEventDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) => service.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar", "events"] })
    },
  })
}

// Conectar (redireciona para OAuth)
export function useGoogleCalendarConnect() {
  return useMutation({
    mutationFn: async () => service.connect(),
  })
}

// Desconectar
export function useGoogleCalendarDisconnect() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => service.disconnect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar"] })
    },
  })
}