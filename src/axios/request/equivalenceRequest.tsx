import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const SearchEquivalences = async (productId: number) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/equivalences/${productId}`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err) {
    throw err;
  }
};
