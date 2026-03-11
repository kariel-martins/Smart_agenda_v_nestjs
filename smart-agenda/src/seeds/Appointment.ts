import { faker } from "@faker-js/faker";

export type Appointment = {
  id: string;
  client: string;
  service: string;
  professional: string;
  time: string;
};

export const generateAppointments = Array.from({ length: 10 }).map(() => ({
    id: faker.string.uuid(),
    client: faker.person.fullName(),
    service: faker.helpers.arrayElement([
      "Corte de cabelo",
      "Barba",
      "Manicure",
      "Pedicure",
      "Sobrancelha",
    ]),
    professional: faker.person.firstName(),
    time: faker.date.soon().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));