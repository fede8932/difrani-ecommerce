import axios, { AxiosInstance } from "axios";

interface AxiosInstances {
  api: AxiosInstance;
}

const { VITE_MY_URL_BACKEND } = import.meta.env;

// Obtener el subdominio del frontend
const subdomain = window.location.hostname.split(".")[0];

// eslint-disable-next-line prefer-const
let axiosInstances: AxiosInstances = {
  api: axios.create({
    baseURL: VITE_MY_URL_BACKEND,
    withCredentials: true,
    headers: {
      "X-Subdomain": subdomain, // Añadir el subdominio como un header personalizado
    },
  }),
};

export default axiosInstances;
