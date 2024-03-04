import { makeAutoObservable } from "mobx";

interface IStorePage {
  title: string;
  description: string;
  tdk: string;
}

export function createStorePage() {
  return makeAutoObservable<IStorePage>({
    title: "低代码开发页面",
    description: "低代码开发页面详情",
    tdk: "low-code,低代码",
  });
}

export type TStorePage = ReturnType<typeof createStorePage>;
