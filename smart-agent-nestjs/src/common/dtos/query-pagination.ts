import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'

export class QueryPaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  size?: number
}

export interface PaginatedResponseDTO<T> {
  data: T[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    totalPerPage: number
    prevPage: number | null
    nextPage: number | null
  }
}
