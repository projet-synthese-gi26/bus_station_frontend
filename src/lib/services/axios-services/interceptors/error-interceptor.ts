import {AxiosInstance, AxiosResponse} from "axios";

export default function errorInterceptor (axiosInstance: AxiosInstance) {

    axiosInstance.interceptors.response.use((res: AxiosResponse) =>
        {
            return res;
        },
        error => {
            console.group("Axios Error");
            console.error(error);
            console.groupEnd();

            return error.response
        }
    )
}

