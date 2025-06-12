/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { CancelTokenSource } from "axios";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

interface ISearchCatalogo {
  page: number;
  rows: number;
  text?: string;
  vMarc?: string;
  pMarc?: string;
  sale?: boolean;
}

let cancelTokenSource: CancelTokenSource | null = null;

export const SearchCatalogo = async (sendData: ISearchCatalogo) => {
  // Cancelar la solicitud anterior si existe
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Operation canceled due to new request.");
  }

  // Crear un nuevo token de cancelación para la nueva solicitud
  cancelTokenSource = axios.CancelToken.source();

  try {
    const { text, rows, page, vMarc, pMarc, sale } = sendData;
    let url: string = `${apiUrl}/api/productos/search/prod?ecomm=true&page=${page}&cant=${rows}`;
    url = text ? `${url}&data=${text}` : url;
    url = vMarc ? `${url}&vmarc=${vMarc}` : url;
    url = pMarc ? `${url}&pmarc=${pMarc}` : url;
    url = sale ? `${url}&sale=${sale}` : url;

    // Hacer la solicitud con el nuevo token de cancelación
    const { data } = await axiosInstances.api.get(url, {
      cancelToken: cancelTokenSource.token,
    });

    // Limpiar el token de cancelación una vez completada la solicitud
    cancelTokenSource = null;

    return data;
  } catch (err: any) {
    // Manejar el error si es una cancelación
    if (axios.isCancel(err)) {
      console.log("Request canceled", err.message);
      return { totalPages: 0, list: [] }; // O manejar de alguna forma adecuada en tu aplicación
    } else if (err.response?.status == 401) {
      window.location.reload();
    } else {
      throw err;
    }
  }
};

export const getAllProducts = async (clientId: number) => {
  try {
    // console.log(clientId);
    const res = await axiosInstances.api.get(
      `${apiUrl}/api/productos/all?clientId=${clientId}`,
      {
        responseType: "blob", // Configura el tipo de respuesta esperado como 'blob'
      }
    );
    return res;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};

export const getAllNews = async (): Promise<any[]> => {
  try {
    // console.log(clientId);
    const res: any = await axiosInstances.api.get(
      `${apiUrl}/api/productos/all/news`
    );
    return res.data;
  } catch (err: any) {
    if (err.response?.status == 401) {
      window.location.reload();
    }
    throw err;
  }
};
