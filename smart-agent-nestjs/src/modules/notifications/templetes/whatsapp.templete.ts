export function ConfirmOrder(data: any) {
  return `✅ *Pedido confirmado!*

Olá, ${data.name}

Seu pedido foi recebido com sucesso.

📄 *Pedido:* #${data.id}
💰 *Total:* R$ ${data.valor}

Em breve iniciaremos o processamento 🚀`;
}

export function reminder(data: any) {
  return `⏰ *Lembrete*

Olá, ${data.name}!

Seu agendamento é amanhã:

📅 ${data.date} às ${data.hour}

Se precisar remarcar, é só avisar.`;
}

export function PaymentApproved(data: any) {
  return `💳✅ *Pagamento aprovado*

Olá, ${data.name}!

Seu pagamento foi aprovado com sucesso.

Seu pedido já está em andamento 🚀`;
}

export function PaymentDeclined(data: any) {
  return `❌ *Pagamento não aprovado*

Olá, ${data.name}!

Não conseguimos aprovar seu pagamento.

Tente novamente ou use outra forma de pagamento.`;
}

export function shortVersion(appointmentId: string) {
  return `📅 *Agendamento criado!*

🆔 ID: *${appointmentId}*

Responda:
*CONFIRM* para confirmar
*CANCEL* para cancelar`;
}
