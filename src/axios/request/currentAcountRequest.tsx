/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISend } from "../../redux/reducers/acountReducer";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const GetCurrentAcount = async (sendData: ISend) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { clientId, page, rows, pending } = sendData;
    let url: string = `${apiUrl}/api/client/acount/pages/${clientId}?page=${page}&rows=${rows}&ecom={true}`;
    if (pending) {
      url = url + `&pending=${pending}`;
    }
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
