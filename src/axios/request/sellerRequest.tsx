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
