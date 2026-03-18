import { BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

export async function guardClientRestrictions(
  clientId: string,
  prisma: PrismaService,
) {
  const client = await prisma.client.findUniqueOrThrow({
    where: { id: clientId },
    select: {
      isBlocked: true,
      requiresDeposit: true,
      pendingApproval: true,
    },
  });

  if (client.isBlocked) {
    throw new BadRequestException(
      "Cliente bloqueado por excesso de no-shows. Contate o estabelecimento.",
    );
  }

  if (client.pendingApproval) {
    throw new BadRequestException(
      "Agendamento deste cliente requer aprovação manual.",
    );
  }

  return client.requiresDeposit;
}
