interface IUser {
    id: number;
    phone: string;
    openId: string;
    avatar: string;
    username: string;
    password: string;
}

type TComponentTypes = "video" | "swiper" | "qrcode" | "card" | "list" | "image" | "titleText" | "split" | "richText" | "input" | "textArea" | "radio" | "checkbox" | "empty" | "alert";

interface ILowCode {
    id: number;
    account_id: number;
    page_name: string;
    components: string[];
    tdk: string;
    desc: string;
}
interface IComponent {
    id: number;
    account_id: number;
    page_id: number;
    type: TComponentTypes;
    options: Record<string, any>;
}
interface IComponentData {
    id: number;
    user: string;
    page_id: number;
    props: Record<string, any>;
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

type PostReleaseRequest = Omit<ILowCode, "id" | "account_id" | "components"> & {
    components: Omit<IComponent, "account_id" | "page_id">[];
};

export type { CaptchaRequest, IComponent, IComponentData, ILowCode, IUser, LoginWithPasswordRequest, LoginWithPhoneRequest, PostReleaseRequest, RegisterRequest, SendCodeRequest, TComponentTypes };
