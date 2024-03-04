import { computed, action } from "mobx";
import { createStoreAuth } from "../store";
import { useNavigate } from "react-router-dom";

export const storeAuth = createStoreAuth();
export function useStoreAuth() {
  const nav = useNavigate();

  // 判断是否登录
  const isLogin = computed(() => !!storeAuth.token);

  // 登录
  const login = action(async (token: string) => {
    storeAuth.token = token;
    localStorage.setItem("token", token);
    nav("/editor");
  });

  return { isLogin, login };
}
