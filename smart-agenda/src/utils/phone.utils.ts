export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function validateBrazilianPhone(phone: string): boolean {
  const digits = normalizePhone(phone);

  return /^(55)?(\d{2})(9\d{8}|\d{8})$/.test(digits);
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhone(phone).replace(/^55/, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}