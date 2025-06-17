/* eslint-disable @typescript-eslint/no-explicit-any */
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



export function selectStylesByDate(fechaStr: string){
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  // Calcular la diferencia en milisegundos
  const diferenciaMs = hoy.getTime() - fecha.getTime();
  // Convertir la diferencia a días
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  if(dias < 10) return "green"
  if(dias < 20) return "blue"
  if(dias < 32) return "yellow"
  return "red"
}

export function selectStylesByDateClient(fechaStr: string){
  if(!fechaStr) return "rgba(86, 255, 158, 0.3)"
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  // Calcular la diferencia en milisegundos
  const diferenciaMs = hoy.getTime() - fecha.getTime();
  // Convertir la diferencia a días
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  if(dias < 10) return "rgba(86, 255, 158, 0.3)"
  if(dias < 20) return "rgba(0, 109, 247 , 0.3)"
  if(dias < 32) return "rgba(255, 219, 86, 0.3)"
  return "rgba(255, 86, 106, 0.3)"
}

let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  deferredPrompt = e as any;
});

export const instalarPWA = async () => {
  if (!deferredPrompt) {
    console.log('No hay evento de instalación disponible');
    return;
  }

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('PWA instalada correctamente');
  } else {
    console.log('El usuario canceló la instalación');
  }

  deferredPrompt = null;
};