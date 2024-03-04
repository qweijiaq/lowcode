import type {
  LoginWithPasswordRequest,
  LoginWithPhoneRequest,
  RegisterRequest,
  SendCodeRequest,
} from "@lowcode/share";
import request from "../utils/request";

/**
 * 短信验证码
 */
export async function sendCode(data: SendCodeRequest) {
  return request("/user/send_code", {
    data,
    method: "POST",
  });
}

/**
 * 图形验证码
 */
export async function getCaptcha(data: { type: string }) {
  return request("/user/captcha", {
    data,
    method: "POST",
  });
}

/**
 * 注册
 */
export async function getRegister(data: RegisterRequest) {
  return request("/user/register", {
    data,
    method: "POST",
  });
}

/**
 * 账号密码登录
 */
export async function getLoginWithPassword(data: LoginWithPasswordRequest) {
  return request("/user/password_login", {
    data,
    method: "POST",
  });
}

/**
 * 短信验证码登录
 */
export async function getLoginWithPhone(data: LoginWithPhoneRequest) {
  return request("/user/phone_login", {
    data,
    method: "POST",
  });
}
