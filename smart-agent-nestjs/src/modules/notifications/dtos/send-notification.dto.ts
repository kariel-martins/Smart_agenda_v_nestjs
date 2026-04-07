export interface InsertWhatsApp {
  to: string;
  message?: string;
}

type TypeData = "whatsapp" | "email";

export interface InsertWhatsAppRequest extends InsertWhatsApp {
  type: TypeData;
  action: string;
  data?: any;
}
