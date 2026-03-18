import { axiosInstance } from "@/lib/axios";
import type { NoShowRequest, NoShowRuleData, UpdateNoShowRequest } from "./dtos/noShowRules.dto.type";

export class NoShowRulesServices {
    async create(data: NoShowRequest) {
        const result = await axiosInstance.post<NoShowRuleData>('/no-show-rules', data)

        return result.data
    }

    async findAll() {
        const result = await axiosInstance.get<NoShowRuleData[]>('/no-show-rules')

        return result.data
    }

    async update(data: UpdateNoShowRequest) {
        const { id, ...rest} = data
        const result = await axiosInstance.put<NoShowRuleData>(`/no-show-rules/${id}`, rest)

        return result.data
    }

    async remove(id: number) {
        const result = await axiosInstance.delete(`/no-show-rules/${id}`)

        return result.data
    }
}