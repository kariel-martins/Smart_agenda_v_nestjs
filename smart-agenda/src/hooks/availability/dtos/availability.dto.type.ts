export interface Availabity {
  id: number;
  professionalId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export type AvailabilityForm = Pick<
  Availabity,
  "dayOfWeek" | "startTime" | "endTime"
>;

export interface AvailabityRequestDTO {
  professinalId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabityRequestDTO {
  availabilityId: number;
  professinalId: number;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
}

export interface ParamsDTO { id: number, professinalId: number }
