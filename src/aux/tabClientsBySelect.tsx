import { IClient } from "../redux/reducers/sellerReducer";

interface Ans {
  key: string;
  value: string;
}

export const tabClientsBySelect = (list: IClient[]): Ans[] => {
  const ans: Ans[] = list.map((item) => {
    const obj: Ans = {
      key: item.razonSocial.toLocaleUpperCase(),
      value: item.id.toString(),
    };
    return obj;
  });
  return ans;
};
