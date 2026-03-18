import { axiosInstance } from "@/lib/axios";
import type {
  FindAllServiceData,
  findServiceByIdDTO,
  Service,
  ServiceRequestDTO,
  ServiceUpdateRequestDTO,
} from "./dtos/service.dtos.type";

export class ServiceService {
  async create(data: ServiceRequestDTO) {
    const result = await axiosInstance.post<Service>("/services", data);
    return result.data;
  }

  async findById(id: number) {
    const result = await axiosInstance.get<findServiceByIdDTO>(`/services/${id}`);
    return result.data;
  }

  async findAll() {
    const result = await axiosInstance.get<FindAllServiceData>("/services");
    return result.data;
  }

  async update(data: ServiceUpdateRequestDTO) {
    const result = await axiosInstance.put(`/services/${data.id}`, data);
    return result.data;
  }

  async remove(id: number) {
    const result = await axiosInstance.delete(`/services/${id}`);
    return result.data;
  }
}
