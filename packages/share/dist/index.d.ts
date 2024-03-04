interface IUser {
    id: number;
    phone: string;
    openId: string;
    avatar: string;
    username: string;
    password: string;
}

interface CaptchaRequest {
    type: "register" | "login";
}
type RegisterRequest = Pick<IUser, "phone" | "password"> & {
    sendCode: string;
    confirm: string;
};
type SendCodeRequest = Pick<IUser, "phone"> & {
    captcha: string;
} & CaptchaRequest;
type LoginWithPasswordRequest = Pick<IUser, "phone" | "password">;
type LoginWithPhoneRequest = Pick<IUser, "phone"> & {
    sendCode: string;
};

export type { CaptchaRequest, IUser, LoginWithPasswordRequest, LoginWithPhoneRequest, RegisterRequest, SendCodeRequest };
