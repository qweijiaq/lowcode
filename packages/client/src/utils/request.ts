import { message } from "antd";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import type { IBase } from "../api/types";
import { storeAuth } from "../hooks/useStoreAuth";

export const BASE_URL = "http://127.0.0.1:3001/api";
const request = axios.create({ baseURL: `${BASE_URL}` });

// 请求拦截器
request.interceptors.request.use((config) => {
  if (storeAuth.token) config.headers.Authorization = storeAuth.token;

  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const data = response?.data as IBase;

    if (data.code === 0 && data.msg !== undefined) message.success(data.msg);

    return response;
  },
  (err) => {
    const { code, response } = err;
    if (code === "ERR_BAD_REQUEST") {
      message.warning(response?.data.msg) ?? message.warning("出现未知错误");
    }
  }
);

export default async function makeRequest(
  url: string,
  options?: AxiosRequestConfig
) {
  return (
    await request({
      url,
      ...options,
    })
  ).data;
}
