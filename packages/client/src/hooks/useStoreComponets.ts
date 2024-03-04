import { ulid } from "ulid";
import { action, computed } from "mobx";
import type { TComponentPropsUnion, TComponentTypes } from "@lowcode/share";
import { calcValueByString } from "@lowcode/share";
import { createStoreComponents } from "../store";

const storeComponents = createStoreComponents();

export function useStoreComponents() {
  // 默认选中的组件
  const setCurrentComponent = action((id: string) => {
    storeComponents.currentCompConfig = id;
  });

  // 定义添加组件的函数
  const push = action((type: TComponentTypes) => {
    // 创建一个新的组件配置
    const comp: TComponentPropsUnion = { id: ulid(), type, props: {} };
    storeComponents.compConfigs[comp.id] = comp;
    storeComponents.sortableCompConfig.push(comp.id);
    // 设置默认选中的组件
    setCurrentComponent(comp.id);
  });

  // 定义根据id获取组件配置的函数
  const getComponentById = action((id: string) => {
    return storeComponents.compConfigs[id];
  });

  // 判断是否为当前组件
  const isCurrentComponent = action((compConfig: TComponentPropsUnion) => {
    return getCurrentComponentConfig.get()?.id === compConfig.id;
  });

  // 返回默认选中组件属性信息
  const getCurrentComponentConfig = computed(() => {
    return storeComponents.currentCompConfig
      ? storeComponents.compConfigs[storeComponents.currentCompConfig]
      : null;
  });

  // 定义根据props更新当前组件的函数
  const updateCurrentComponent = action(
    (compConfig: TComponentPropsUnion["props"]) => {
      // 遍历传入的compConfig对象，更新当前组件配置的props属性
      const curCompConfig = getCurrentComponentConfig.get();
      if (!curCompConfig) return;

      for (const [key, value] of Object.entries(compConfig)) {
        // 更新当前组件配置的props属性
        // @ts-expect-error ignore type
        curCompConfig.props[key] = calcValueByString(value);
      }
    }
  );

  // 定义带有数组参数的更新当前组件配置的函数
  type TUpdateCurrentCompConfigWithArray = (args: {
    key: string;
    index: number;
    field: string;
    value: string;
  }) => void;
  const updateCurrentCompConfigWithArray: TUpdateCurrentCompConfigWithArray =
    action(({ key, index, field, value }) => {
      // 获取当前组件配置
      const curCompConfig = getCurrentComponentConfig.get();
      if (!curCompConfig) return;

      // 更新当前组件配置的props属性
      curCompConfig.props[key][index][field] = value;
    });

  return {
    push,
    getComponentById,
    isCurrentComponent,
    getCurrentComponentConfig,
    setCurrentComponent,
    store: storeComponents,
    updateCurrentComponent,
    updateCurrentCompConfigWithArray,
  };
}
