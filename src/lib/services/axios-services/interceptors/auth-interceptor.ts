import {AxiosError, AxiosInstance, InternalAxiosRequestConfig} from "axios";


export const tokenKeyName: string = "bus_station_token_key";

export default function authInterceptor  (axiosInstance: AxiosInstance): void
{
  axiosInstance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
      const token: string|null = localStorage.getItem(tokenKeyName);

      if (token)
      {
        req.headers["Authorization"] = "Bearer " + token;
      }
      return req;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    }
  );
}


