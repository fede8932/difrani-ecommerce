import { IResGetDiscounts } from "../../redux/reducers/discountsReducer";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const GetAllCustomerDiscounts = async (
  clientId: number
): Promise<IResGetDiscounts[]> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/discounts?clientId=${clientId}`;
    const { data }: { data: IResGetDiscounts[] } = await axiosInstances.api.get(
      url
    );
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
