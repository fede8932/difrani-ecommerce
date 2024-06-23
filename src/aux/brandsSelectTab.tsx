import { IGetBrandsInitialState } from "../redux/reducers/brandListReducers";

export const brandsSelectTab = (
  state: IGetBrandsInitialState
): { key: string; value: string }[] => {
  const { list } = state;
  return list.map((brand) => {
    const option: { key: string; value: string } = {
      key: brand.name,
      value: brand.id.toString(),
    };
    return option;
  });
};

export const searchBrandById = (
  state: IGetBrandsInitialState,
  id: number | null
): string => {
  const brand = state.list.find((b) => b.id == id);
  return brand?.name || "";
};
