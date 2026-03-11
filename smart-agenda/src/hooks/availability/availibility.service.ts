import { axiosInstance } from "@/lib/axios";
import type { AvailabityRequestDTO, ParamsDTO, UpdateAvailabityRequestDTO } from "./dtos/availability.dto.type";

export class AvailabilityService {
    async create(data: AvailabityRequestDTO) {
        const { professinalId, ...rest } = data
        const result = await axiosInstance.post(`/professional/${data.professinalId}/availability`, rest)

        return result.data
    }

    async findById(params: { id: number, professinalId: number }) {
        const { data } = await axiosInstance.get(`/professional/${params.professinalId}/availability/${params.id}`)

        return data
    }

    async findAll(professinalId: number) {
        const { data } = await axiosInstance.get(`/professional/${professinalId}/availability`)
        return data
    }

    async update(data: UpdateAvailabityRequestDTO) {
        const result = await axiosInstance.put(`/professional/${data.professinalId}/availability/${data.availabilityId}`)

        return result.data
    }

    async remove(params: ParamsDTO) {
        const result = await axiosInstance.delete(`/professional/${params.professinalId}/availability/${params.id}`)

        return result.data
    }
}