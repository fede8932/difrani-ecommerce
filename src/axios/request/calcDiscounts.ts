/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { IResAddItem } from "../../redux/reducers/cartListReducer";
import { IResGetDiscounts } from "../../redux/reducers/discountsReducer";
import { calcularItemSubTotalNumber } from "../../aux/prices";

interface IBrandDiscount {
  brandId: number;
  totalItems: number;
  sales: any[];
  gravado: number;
}
interface IProductDiscount {
  productId: number;
  totalItems: number;
  sales: any[];
  gravado: number;
}

export function calcDiscounts(
  data: IResAddItem[],
  discount: IResGetDiscounts[]
): number {
  let brandDiscounts: IBrandDiscount[] = [];
  let productDiscounts: IProductDiscount[] = [];
  const listBrandControl: IResAddItem[] = [...data];

  let totalDiscount = 0;

  const listProductControl: IResAddItem[] = listBrandControl?.filter((item) => {
    if (item.product.brand.sales?.length > 0) {
      const index = brandDiscounts.findIndex(
        (bd) => bd.brandId == item.product.brand.id
      );
      if (index == -1) {
        brandDiscounts.push({
          brandId: item.product.brand.id,
          totalItems: item.amount,
          sales: [...item.product.brand.sales].sort(
            (a, b) => a.prioridad - b.prioridad
          ),
          gravado: calcularItemSubTotalNumber(
            item.product?.price.price,
            item.product?.brand.id,
            item.product?.brand.rentabilidad,
            discount,
            item.amount
          ),
        });
      } else {
        brandDiscounts[index].totalItems += item.amount;
        brandDiscounts[index].gravado +=
          item.amount +
          calcularItemSubTotalNumber(
            item.product?.price.price,
            item.product?.brand.id,
            item.product?.brand.rentabilidad,
            discount,
            item.amount
          );
      }
      return false;
    }
    return true;
  });

//   console.log(brandDiscounts)

  listProductControl.map((item) => {
    if (item.product.sales?.length > 0) {
      const index = productDiscounts.findIndex(
        (pd) => pd.productId == item.product.id
      );
      if (index == -1) {
        productDiscounts.push({
          productId: item.product.id,
          totalItems: item.amount,
          sales: [...item.product.sales].sort(
            (a, b) => a.prioridad - b.prioridad
          ),
          gravado: calcularItemSubTotalNumber(
            item.product?.price.price,
            item.product?.brand.id,
            item.product?.brand.rentabilidad,
            discount,
            item.amount
          ),
        });
      } else {
        productDiscounts[index].totalItems += item.amount;
        productDiscounts[index].gravado += calcularItemSubTotalNumber(
          item.product?.price.price,
          item.product?.brand.id,
          item.product?.brand.rentabilidad,
          discount,
          item.amount
        );
      }
    }
  });

  brandDiscounts.map((bd) => {
    let lap = 0;
    while (lap < bd.sales.length) {
      const sale = bd.sales[lap];
      //Cumple ??
      if (bd.totalItems >= sale.minUnit) {
        totalDiscount += bd.gravado * sale.percentage;
        break;
      }
      lap++;
    }

  });

  productDiscounts.map((pd) => {
    let lap = 0;
    while (lap < pd.sales.length) {
      const sale = pd.sales[lap];
      //Cumple ??
      if (pd.totalItems >= sale.minUnit) {
        totalDiscount += pd.gravado * sale.percentage;
        break;
      }
      lap++;
    }
  });

  return totalDiscount;
}
