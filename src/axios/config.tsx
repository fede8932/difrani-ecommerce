import axios, { AxiosInstance } from "axios";

interface AxiosInstances {
  api: AxiosInstance;
}

const { VITE_MY_URL_BACKEND } = import.meta.env;

// eslint-disable-next-line prefer-const
let axiosInstances: AxiosInstances = {
  api: axios.create({
    baseURL: VITE_MY_URL_BACKEND,
    withCredentials: true,
  }),
};

export default axiosInstances;
