import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

interface ISearchCatalogo {
  page: number;
  rows: number;
  text?: string;
  vMarc?: string;
  pMarc?: string;
}

export const SearchCatalogo = async (sendData: ISearchCatalogo) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { text, rows, page, vMarc, pMarc } = sendData;
    let url: string = `${apiUrl}/api/productos/search/prod?page=${page}&cant=${rows}`;
    url = text ? `${url}&data=${text}` : url;
    url = vMarc ? `${url}&vmarc=${vMarc}` : url;
    url = pMarc ? `${url}&pmarc=${pMarc}` : url;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err) {
    throw err;
  }
};
