import axiosInstances from "../config";

const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export interface IPaymentMethodDiscount {
  id: number;
  paymentMethod: string;
  percentage: number;
  notes?: string | null;
  active: boolean;
}

export const GetAllPaymentMethodDiscounts = async (): Promise<IPaymentMethodDiscount[]> => {
  try {
    const url: string = `${apiUrl}/api/payment-discount`;
    const { data }: { data: IPaymentMethodDiscount[] } =
      await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
