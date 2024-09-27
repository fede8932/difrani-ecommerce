export function formatNumbers(value: number): string {
  // Convertimos el número a un string con la parte entera y decimal separadas por un punto
  const [integerPart, decimalPart] = value.toFixed(2).split(".");

  // Usamos una expresión regular para añadir los puntos en las divisiones de millones, miles y cientos
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );

  // Retornamos la parte entera formateada y la parte decimal unidas por una coma
  return `${formattedIntegerPart},${decimalPart}`;
}
