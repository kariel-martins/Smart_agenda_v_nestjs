import { axiosInstance } from "@/lib/axios";
import type {
  FindAllProfessionalData,
  Professional,
  ProfessionalById,
  ProfessionalRequestDTO,
  UpdateProfessionalRequestDTO,
} from "./dtos/professional.types";

export class ProfessionalService {
  async create(data: ProfessionalRequestDTO) {
    const result = await axiosInstance.post<Professional>(
      "/professionals",
      data,
    );
    return result.data;
  }

  async findById(id: number) {
    const result = await axiosInstance.get<ProfessionalById>(`/professionals/${id}`)
    return result.data
  }

  async findAll() {
    const result = await axiosInstance.get<FindAllProfessionalData>('/professionals/')

    return result.data
  }

   async update(data: UpdateProfessionalRequestDTO) {
    const { id, ...rest} = data
    const result = await axiosInstance.put<Professional>(
      `/professionals/${id}`,
      rest,
    );
    return result.data;
  }


  async delete(id: number) {
    const result = await axiosInstance.delete<void>(`/professionals/${id}`)

    return result.data
  }

}
