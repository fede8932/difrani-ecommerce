import { ILogin } from "../../redux/reducers/userReducer";
import axiosInstances from "../config";
const apiUrl = import.meta.env.VITE_MY_URL_BACKEND;

export const Login = async (sendData: ILogin) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let url: string = `${apiUrl}/api/users/login/shop`;
    const { data } = await axiosInstances.api.post(url, sendData);
    return data;
  } catch (err) {
    throw err;
  }
};

export const Me = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    let url: string = `${apiUrl}/api/users/login/me/shop`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

export const LogOut = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/users/login/logout/shop`;
    const { data } = await axiosInstances.api.get(url);
    return data;
  } catch (err) {
    throw err;
  }
};

export const ChangePassReq = async (sendData: {
  pass: string;
  newPass: string;
}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url: string = `${apiUrl}/api/users/login/update/pass`;
    const { data } = await axiosInstances.api.post(
      url,
      { password: sendData.pass, newPassword: sendData.newPass },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
};
