import { IMovements, ISelectMovements } from "./redux/reducers/acountReducer";

export const checkActive = (mov: IMovements): boolean => {
  if (mov.payInProcess) return true;
  if (mov.type == 0 && mov.pending != true) return true; // Factura no pendiente
  if ((mov.type == 1 || mov.type == 3) && mov.apply == true) return true; // Nota de crédito aplicada
  if (mov.type != 0 && mov.type != 1 && mov.type != 3) return true;
  if (!mov.pending) return true;
  return false;
};
export function truncarADosDecimales(numero: number) {
  return Math.trunc(numero * 100) / 100;
}
export function getMarc(
  mov: IMovements,
  selectMovs: ISelectMovements[]
): boolean {
  return selectMovs.some((item) => item.movement.id == mov.id);
}
export function redondearCuatroDecimales(num: number) {
  return parseFloat(num.toFixed(4));
}
export function applyInTermPayDiscount(num: number) {
  const total = num * (1 - 0.06);
  return parseFloat(total.toFixed(2));
}
