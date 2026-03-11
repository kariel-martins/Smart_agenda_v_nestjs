export type Client = {
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  id: string;
  businessId: string;
  noShowCount: number | null;
  totalAppointments: number | null;
};

export type metaType = {
  total: number;
  lastPage: number;
  currentPage: number;
  totalPerPage: number;
  prevPage: number | null;
  nextPage: number | null;
};

export type ClientRequestData = {
  name: string;
  phone: string;
  email: string;
};

export type UpdateClientRequestData = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
};

export type FindQueryClientData = {
  name: string;
  phone: string;
  email: string;
};

export type ClientForm = Pick<Client, "name" | "phone" | "email">;

export type ClientFindAll = {
  data: [Client];
  meta: metaType;
};

export type findAllData = {
    page?: number;
    size?: number;
};
