import { axiosInstance } from "@/lib/axios";
import type { BusinessProfile, UpdateBusinessData } from "./dtos/business.dto.type";

export class BusinessService {
    async findBusiness() {
        const result = await axiosInstance.get<BusinessProfile>("/business/profile")

        return result.data
    }

    async update(data: UpdateBusinessData) {
        const result = await axiosInstance.put("business/profile", data)

        return result.data
    }
}
