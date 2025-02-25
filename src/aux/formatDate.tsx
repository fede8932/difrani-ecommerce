export function formatDate(isoDate: string, recort?: boolean): string {
  const date = new Date(isoDate);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getUTCFullYear();

  const recortYear = year.toString().substring(2, 4);

  return `${day}-${month}-${recort ? recortYear : year}`;
}
