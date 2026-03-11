export function errorResponce(
  errorStatus?: number,
): { message: string } {
  switch (errorStatus) {
    case 401:
      return { message: "Não autorizado!" };
    default:
      return { message: "Erro inesperado!" };
  }
}
