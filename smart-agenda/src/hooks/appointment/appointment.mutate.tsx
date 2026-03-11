import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AppointmentService } from "./appointment.service";

const service = new AppointmentService()

export function useAppointmentFindAll() {
    return useQuery({
        queryFn: () => service.findAll(),
        queryKey: ['appointment'],
    })
}

export function useAppointmentCreate() {
    const queryClient = new QueryClient()

    return useMutation({
        mutationFn: service.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointment']})
        }
    })
}

export function useAppointmentUpdate() {
    const queryClient = new QueryClient()

    return useMutation({
        mutationFn: service.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointment']})
        }
    })
}
