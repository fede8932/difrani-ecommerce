/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResAddItem } from "../redux/reducers/cartListReducer";
import { IResGetDiscounts } from "../redux/reducers/discountsReducer";
import { IRentaState, IResGetRentab } from "../redux/reducers/rentabReducer";
import { IProduct } from "../redux/reducers/searchInputReducer";

export function roundToTwoDecimals(num: number): string {
  // Redondear a dos decimales
  const rounded: number = Math.round(num * 100) / 100;

  // Convertir a cadena y asegurar dos decimales
  const ans: string = rounded.toFixed(2);

  return ans;
}

export const calcularPrice = (
  product: IProduct,
  discounts: IResGetDiscounts[],
  type: "price" | "endPrice"
): string => {
  const discount: IResGetDiscounts | undefined = discounts.find(
    (discount) => discount.brandId == product.brand.id
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const price: any = discount
    ? product.price[type] *
      (1 + discount.porcentaje) *
      (1 + product.brand.rentabilidad)
    : product.price[type] * (1 + product.brand.rentabilidad);

  return roundToTwoDecimals(price);
};

export const calcularSellPrice = (
  // Sin iva
  product: IProduct,
  discounts: IResGetDiscounts[],
  rentabState: IRentaState
): string => {
  const discount: IResGetDiscounts | undefined = discounts.find(
    (discount) => discount.brandId == product.brand.id
  );
  const rentab: IResGetRentab =
    rentabState.byBrand.find((rent) => rent.brandId == product.brand.id) ||
    rentabState.general;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const price: any = discount
    ? product.price.price *
      (1 + discount.porcentaje) *
      (1 + product.brand.rentabilidad)
    : product.price.price * (1 + product.brand.rentabilidad);
  const sellPrice = price * (1 + rentab.surchargePercentage);

  return roundToTwoDecimals(sellPrice);
};

export const calcularBuyPrice = (
  // Sin iva
  price: number,
  brandId: number,
  blaseRent: number,
  discounts: IResGetDiscounts[]
): string => {
  const discount: IResGetDiscounts | undefined = discounts.find(
    (discount) => discount.brandId == brandId
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buyPrice: any = discount
    ? price * (1 + discount.porcentaje) * (1 + blaseRent)
    : price * (1 + blaseRent);

  return roundToTwoDecimals(buyPrice);
};

export const calcularItemSubTotal = (
  // Sin iva
  price: number,
  brandId: number,
  blaseRent: number,
  discounts: IResGetDiscounts[],
  amount: number
): string => {
  const discount: IResGetDiscounts | undefined = discounts.find(
    (discount) => discount.brandId == brandId
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buyPrice: any = discount
    ? price * (1 + discount.porcentaje) * (1 + blaseRent)
    : price * (1 + blaseRent);

  return roundToTwoDecimals(buyPrice * amount);
};

export const calcularItemSubTotalNumber = (
  // Sin iva
  price: number,
  brandId: number,
  blaseRent: number,
  discounts: IResGetDiscounts[],
  amount: number
): number => {
  const discount: IResGetDiscounts | undefined = discounts?.find(
    (discount) => discount.brandId == brandId
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buyPrice: any = discount
    ? price * (1 + discount.porcentaje) * (1 + blaseRent)
    : price * (1 + blaseRent);

  return buyPrice * amount;
};

export const calcularSubTotal = (
  product: IProduct,
  discounts: IResGetDiscounts[],
  rentabState: IRentaState,
  amount: string
): string => {
  if (isNaN(Number(amount))) return "0.00";
  const discount: IResGetDiscounts | undefined = discounts.find(
    (discount) => discount.brandId == product.brand.id
  );
  const rentab: IResGetRentab =
    rentabState.byBrand.find((rent) => rent.brandId == product.brand.id) ||
    rentabState.general;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const price: any = discount
    ? product.price.price *
      (1 + discount.porcentaje) *
      (1 + product.brand.rentabilidad)
    : product.price.price * (1 + product.brand.rentabilidad);
  const sellPrice = price * (1 + rentab.surchargePercentage);

  return roundToTwoDecimals(sellPrice * Number(amount));
};

export const calcularBuyTotal = (
  items: IResAddItem[],
  discounts: IResGetDiscounts[]
): { subtotal: string; total: string; subTotalNumber: number } => {
  let subtotal = 0;
  items.map((item) => {
    const discount: IResGetDiscounts | undefined = discounts.find(
      (discount) => discount.brandId == item.product?.brand.id
    );
    const price: any = discount
      ? item.product?.price.price *
        (1 + discount.porcentaje) *
        (1 + item.product?.brand.rentabilidad)
      : item.product?.price.price * (1 + item.product?.brand.rentabilidad);
    subtotal += price * item.amount;
  });

  return {
    subTotalNumber: subtotal,
    subtotal: roundToTwoDecimals(subtotal),
    total: roundToTwoDecimals(subtotal * 1.21),
  };
};
