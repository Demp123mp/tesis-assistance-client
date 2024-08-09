import { AxiosResponse } from "axios";
import api from "../api";

const authUser = async ({
  password,
  doc,
}: {
  password: string;
  doc: string;
}): Promise<AxiosResponse> => {
  try {
    const response = await api.post("/auth/login", { password, document: doc });
    const token = response.data.token;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    const secondsRemaining = Math.floor((exp * 1000 - Date.now()) / 1000);
    const cookieValue = `${token}; expires=${new Date(Date.now() + secondsRemaining * 1000).toUTCString()}; path=/;`;
    document.cookie = `myqk=${cookieValue}`;
    return response;
  } catch (error: any) {
    const err: any = {
      status: error.response.data.statusCode,
      data: error.response.data.message,
    };
    return err;
  }
};

export { authUser };
