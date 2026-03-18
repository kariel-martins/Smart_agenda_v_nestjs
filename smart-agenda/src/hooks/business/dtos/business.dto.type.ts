

export interface UpdateBusinessData {
  name?: string
  slug?: string
  phone?: string 
  email?: string
}


export type BusinessProfile = {
  name: string;
  slug: string | null;
  phone: string | null;
  email: string;
  active?: boolean;
  timezone?: string;
  createdAt?: string;
};