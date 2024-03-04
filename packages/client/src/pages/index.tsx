import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStoreAuth } from "../hooks";

interface LocationType {
  pathname: string;
}

export default function Home() {
  const { isLogin } = useStoreAuth();
  const nav = useNavigate();
  const location = useLocation();

  function beforceRouteChange(location: LocationType) {
    // 未登录跳转注册登录页面;
    if (!isLogin.get())
      location.pathname !== "/login_or_register" && nav("/login_or_register");
    // 已登录而且当前是'/'或者'login_or_register'路径，则跳转到编辑页面
    else
      ["/", "/login_or_register"].includes(location.pathname) && nav("/editor");
  }

  useEffect(() => {
    beforceRouteChange(location);
  }, [location.pathname]);

  return <Outlet />;
}
