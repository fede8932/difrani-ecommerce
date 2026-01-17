import axiosInstances from "../config";

const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export interface IBrandPaymentMethodDiscount {
  id: number;
  brandId: number;
  brandName: string;
  paymentMethod: string;
  percentage: number;
  notes?: string | null;
  active: boolean;
}

export const GetBrandPaymentMethodDiscounts = async (
  brandId: number
): Promise<IBrandPaymentMethodDiscount[]> => {
  try {
    const url: string = `${apiUrl}/api/brand-payment-discount/by-brand/${brandId}`;
    const { data }: { data: IBrandPaymentMethodDiscount[] } =
      await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
