import { makeAutoObservable } from "mobx";

// mobx 库来创建一个可观察的对象
export function createStoreAuth() {
  // makeAutoObservable 接受一个对象并返回一个可观察的对象，该对象的数据是响应式的
  return makeAutoObservable({
    token: localStorage.getItem("token") ?? "",
    details: null,
  });
}
