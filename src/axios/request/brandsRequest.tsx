import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const GetAllBrands = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/brand`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
