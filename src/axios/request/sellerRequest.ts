/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { IDailyClosingSeller, IDataClos } from "../../redux/reducers/SellerClosing";
import {
  ICreateSellerReceipt,
  IData,
  IPayPending,
} from "../../redux/reducers/SellerReceipt";
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

export const GetSellerReceipt = async (
  pending: boolean,
  page: number
): Promise<IData> => {
  // eslint-disable-next-line no-useless-catch
  try {
    let url: any = `${apiUrl}/api/client/pay/receipt?pending=${pending}&page=${page}`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const GetTotalPayPending = async (): Promise<IPayPending> => {
  // eslint-disable-next-line no-useless-catch
  try {
    let url: any = `${apiUrl}/api/client/pay/pendingTotal`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const ClosingGenerate = async (): Promise<IDailyClosingSeller> => {
  // eslint-disable-next-line no-useless-catch
  try {
    let url: any = `${apiUrl}/api/client/pay/closing`;
    const { data } = await axiosInstances.api.post(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const GetAllClosing = async (sendDate: {
  pending: boolean;
  page: number;
}): Promise<IDataClos> => {
  // eslint-disable-next-line no-useless-catch
  try {

    const {pending, page} = sendDate
    let url: any = `${apiUrl}/api/client/pay/closing?page=${page}&pending=${pending}`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
export const GetClosingId = async (id: number): Promise<IDailyClosingSeller> => {
  // eslint-disable-next-line no-useless-catch
  try {
    let url: any = `${apiUrl}/api/client/pay/closing/get/${id}`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
