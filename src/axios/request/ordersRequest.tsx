import { IGetOrderItems } from "../../redux/reducers/orderItemsReducer";
import { IGetOrders } from "../../redux/reducers/ordersReducer";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const GetAllOrders = async (sendData: IGetOrders) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { clientId, rows, page } = sendData;
    let url: string = `${apiUrl}/api/purchase/order/client/${clientId}?pageSize=${rows}&page=${page}`;
    const {
      data,
    }: { data: { totalPages: number; totalRows: number; list: any[] } } =
      await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
export const GetOrderItems = async (sendData: IGetOrderItems) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { orderId, rows, page } = sendData;
    let url: string = `${apiUrl}/api/purchase/order/getItems/${orderId}?pageSize=${rows}&page=${page}`;
    const {
      data,
    }: { data: { totalPages: number; totalRows: number; list: any[] } } =
      await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
