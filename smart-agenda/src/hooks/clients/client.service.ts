import { axiosInstance } from "@/lib/axios";
import type {
  Client,
  ClientRequestData,
  ClientWithAppointmentFindAll,
  findAllData,
  UpdateClientRequestData,
} from "./dtos/client.dto.type";

export class clientservice {
  async create(data: ClientRequestData) {
    const result = await axiosInstance.post<Client>("/clients", data);
    return result.data;
  }

  async findById(id: string) {
    const result = await axiosInstance.get<Client>(`/clients/${id}`);
    return result.data;
  }

  async findAll(params?: findAllData) {
    const result = await axiosInstance.get<ClientWithAppointmentFindAll>("/clients", {
      params: {
        ...params,
      },
    });
    return result.data;
  }

  async update(data: UpdateClientRequestData) {
    const { id, ...rest } = data
    const result = await axiosInstance.put<Client>(`/clients/${id}`, rest);
    return result.data;
  }

  async remove(id: string) {
    const result = await axiosInstance.delete<Client>(`/clients/${id}`);
    return result.data;
  }
}
