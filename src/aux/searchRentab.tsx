import { IResGetRentab } from "../redux/reducers/rentabReducer";

export function searchRentab(
  byBrand: IResGetRentab[],
  gral: IResGetRentab,
  brandId: number
): IResGetRentab {
  const rentabByBrand: IResGetRentab | undefined = byBrand.find(
    (item) => item.brandId == brandId
  );
  return rentabByBrand ? rentabByBrand : gral;
}
