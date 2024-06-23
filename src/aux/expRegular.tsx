export function cuitValid(cadena: string): boolean {
  const regex = /^\d{2}-\d{8}-\d{1}$/;
  return regex.test(cadena);
}
