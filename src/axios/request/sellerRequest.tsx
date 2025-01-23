/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { ICreateSellerReceipt } from "../../redux/reducers/SellerReceipt";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const GetClientsBySeller = async (userId: number) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let url: string = `${apiUrl}/api/seller/clients/${userId}`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const CreateSellerReceipt = async (
  sendData: ICreateSellerReceipt
): Promise<string> => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (sendData.clientId == null || sendData.userId == null)
      throw new Error("No es posible continuar");
    let url: string = `${apiUrl}/api/client/pay/recib`;
    const { data } = await axiosInstances.api.post(url, sendData);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
