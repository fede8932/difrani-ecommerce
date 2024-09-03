import { IProduct, ISendItemData } from "../../redux/reducers/cartListReducer";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

interface IResAddItem {
  id: number;
  amount: number;
  cartId: number;
  productId: number;
  product: IProduct;
}

export const AddCartItem = async (
  itemData: ISendItemData
): Promise<IResAddItem> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/cart`;
    const { data }: { data: IResAddItem } = await axiosInstances.api.post(
      url,
      itemData
    );
    return data;
  } catch (err) {
    throw err;
  }
};

export const GetAllCartItem = async (
  cartId: number
): Promise<IResAddItem[]> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/cart?cartId=${cartId}`;
    const { data }: { data: IResAddItem[] } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const DeleteCartItem = async (itemId: number): Promise<number> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/cart?id=${itemId}`;
    const { data }: { data: number } = await axiosInstances.api.delete(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const ChangeAmountCartItem = async (sendInfo: {
  itemId: number;
  amount: number;
}): Promise<IResAddItem> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { itemId, amount } = sendInfo;
    const url: string = `${apiUrl}/api/cart?itemId=${itemId}&cant=${amount}`;
    const { data }: { data: IResAddItem } = await axiosInstances.api.patch(url);
    return data;
  } catch (err) {
    throw err;
  }
};

export const SendOrder = async (cartId: number): Promise<string> => {
  try {
    const url: string = `${apiUrl}/api/sale/order/${cartId}`;
    const { data }: { data: string } = await axiosInstances.api.post(url);
    return data;
  } catch (err) {
    throw err;
  }
};
