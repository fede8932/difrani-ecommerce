import {
  IAddGeneralRentab,
  IAddRentab,
  IResGetRentab,
} from "../../redux/reducers/rentabReducer";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const GetAllCustomerRentab = async (
  clientId: number
): Promise<IResGetRentab[]> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/percentage/sale?clientId=${clientId}`;
    const { data }: { data: IResGetRentab[] } = await axiosInstances.api.get(
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

export const UploadGeneralRentab = async (
  AddGralData: IAddGeneralRentab
): Promise<IResGetRentab> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/percentage/sale`;
    const { data }: { data: IResGetRentab } = await axiosInstances.api.patch(
      url,
      AddGralData
    );
    return data;
  } catch (err) {
    throw err;
  }
};

export const DeleteBrandRentab = async (id: number): Promise<number> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/percentage/sale?id=${id}`;
    const { data }: { data: number } = await axiosInstances.api.delete(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const AddBrandRentab = async (
  addRentab: IAddRentab
): Promise<IResGetRentab> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/percentage/sale`;
    const { data }: { data: IResGetRentab } = await axiosInstances.api.post(
      url,
      addRentab
    );
    return data;
  } catch (err) {
    throw err;
  }
};
