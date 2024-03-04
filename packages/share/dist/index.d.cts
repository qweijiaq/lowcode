import * as React from 'react';
import React__default, { FC } from 'react';

interface IUser {
    id: number;
    phone: string;
    openId: string;
    avatar: string;
    username: string;
    password: string;
}

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

type TComponentTypes = "video" | "swiper" | "qrcode" | "card" | "list" | "image" | "titleText" | "split" | "richText" | "input" | "textArea" | "radio" | "checkbox" | "empty" | "alert";
interface IComponentPropWarpper<T> {
    value: T;
    defaultValue: T;
    isHidden: boolean;
}
interface TBasicComponentConfig<T extends TComponentTypes = TComponentTypes, P extends Record<string, any> = object> {
    type: T;
    id: string;
    props: Partial<P>;
}
type TransformedComponentConfig<P extends Record<string, any>> = {
    [key in keyof P]-?: IComponentPropWarpper<P[key]>;
};
type TComponentPropsUnion = TVideoComponentConfig | any;

declare function getComponentByType(type: TBasicComponentConfig["type"]): React.FC<any>;
declare function getDefaultValueByConfig(componentPropsWrapper: TransformedComponentConfig<Record<string, any>>): Record<string, any>;
declare function fillComponentPropsByConfig<T extends TransformedComponentConfig<Record<string, any>>>(props: Record<string, any>, componentPropsWrapper: T): T;

interface IVideoComponentProps {
    src: string;
    poster: string;
    autoPlay: boolean;
    loop: boolean;
    muted: boolean;
    startTime: number;
}
type TVideoComponentConfig = TBasicComponentConfig<"video", IVideoComponentProps>;
type TVideoComponentConfigResult = TransformedComponentConfig<IVideoComponentProps>;
declare const videoComponentDefaultConfig: TVideoComponentConfigResult;

declare function VideoComponent(_props: IVideoComponentProps): React__default.JSX.Element;

interface IImageComponentProps {
    id: string;
    url: string;
    name: string;
    height: string | number;
    handleClicked: "open-url" | "none";
    fit: "contain" | "cover" | "fill" | "none" | "scale-down" | "initial" | "revert" | "unset";
    link?: string;
}
type TImageComponentConfig = TBasicComponentConfig<"image", IImageComponentProps>;
type TImageComponentConfigResult = TransformedComponentConfig<IImageComponentProps>;
declare const defaultImageInfo: IImageComponentProps;
declare const imageComponentDefaultConfig: TImageComponentConfigResult;

declare function ImageComponent(_props: IImageComponentProps): React__default.JSX.Element;

interface ISwiperComponentProps {
    id: string;
    interval: number;
    autoPlay: boolean;
    images: IImageComponentProps[];
    showIndicators: boolean;
    dotPosition: "bottom" | "top" | "left" | "right";
}
type TSwiperComponentConfig = TBasicComponentConfig<"swiper", ISwiperComponentProps>;
type TSwiperComponentConfigResult = TransformedComponentConfig<ISwiperComponentProps>;
declare const swiperComponentDefaultConfig: TSwiperComponentConfigResult;

declare function SwiperComponent(_props: ISwiperComponentProps): React__default.JSX.Element;

interface ICardComponentProps {
    title: string;
    coverImg: string;
    description: string;
}
type TCardComponentConfig = TBasicComponentConfig<"card", ICardComponentProps>;
type TCardComponentConfigResult = TransformedComponentConfig<ICardComponentProps>;
declare const cardComponentDefaultConfig: TCardComponentConfigResult;

declare function CardComponent(_props: ICardComponentProps): React__default.JSX.Element;

interface IListItem {
    id: string;
    title: string;
    avatar: string;
    description: string;
    titleLink: string;
}
interface IListComponentProps {
    id: string;
    items: IListItem[];
}
type TListComponentConfig = TBasicComponentConfig<"list", IListComponentProps>;
type TListComponentConfigResult = TransformedComponentConfig<IListComponentProps>;
declare const listItem: IListItem;
declare const listComponentDefaultConfig: TListComponentConfigResult;

declare function ListComponent(_props: IListComponentProps): React__default.JSX.Element;

interface ITextComponentProps {
    title: string;
    size: "xs" | "sm" | "base" | "lg" | "xl";
}
type TTextComponentConfig = TBasicComponentConfig<"titleText", ITextComponentProps>;
type TTextComponentConfigResult = TransformedComponentConfig<ITextComponentProps>;
declare const textComponentDefaultConfig: TTextComponentConfigResult;

declare function TextComponent(_props: ITextComponentProps): React__default.JSX.Element;

/**
 * 从对象中删除指定的属性
 *
 * @template T - 对象类型
 * @template K - 属性键类型
 * @param {T} obj - 要处理的对象
 * @param {K[]} keys - 要删除的属性键的数组
 * @returns {Omit<T, K>} - 删除属性后的对象
 */
declare function objectOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * 从对象中选择指定的属性并返回新的对象
 * @param obj - 要选择属性的对象
 * @param keys - 要选择的属性键
 * @returns - 包含选择属性的新对象
 */
declare function objectPick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;

declare const componentList: Record<TComponentTypes, FC<any>>;

/**
 * 根据传入的字符串计算值
 * @param str 传入的字符串
 * @returns 计算后的值
 */
declare function calcValueByString(str: string): string | number | boolean;
/**
 * 根据输入的字符串计算数据类型
 * @param str 输入的字符串
 * @returns 数据类型(string, boolean, number)
 */
declare function calcTypeByString(str: string): "number" | "boolean" | "string";

export { type CaptchaRequest, CardComponent, type ICardComponentProps, type IComponent, type IComponentData, type IComponentPropWarpper, type IImageComponentProps, type IListComponentProps, type IListItem, type ILowCode, type ISwiperComponentProps, type ITextComponentProps, type IUser, type IVideoComponentProps, ImageComponent, ListComponent, type LoginWithPasswordRequest, type LoginWithPhoneRequest, type PostReleaseRequest, type RegisterRequest, type SendCodeRequest, SwiperComponent, type TBasicComponentConfig, type TCardComponentConfig, type TCardComponentConfigResult, type TComponentPropsUnion, type TComponentTypes, type TImageComponentConfig, type TImageComponentConfigResult, type TListComponentConfig, type TListComponentConfigResult, type TSwiperComponentConfig, type TSwiperComponentConfigResult, type TTextComponentConfig, type TTextComponentConfigResult, type TVideoComponentConfig, type TVideoComponentConfigResult, TextComponent, type TransformedComponentConfig, VideoComponent, calcTypeByString, calcValueByString, cardComponentDefaultConfig, componentList, defaultImageInfo, fillComponentPropsByConfig, getComponentByType, getDefaultValueByConfig, imageComponentDefaultConfig, listComponentDefaultConfig, listItem, objectOmit, objectPick, swiperComponentDefaultConfig, textComponentDefaultConfig, videoComponentDefaultConfig };
