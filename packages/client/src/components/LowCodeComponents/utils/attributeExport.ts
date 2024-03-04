import type { FC } from "react";
import type { TComponentTypes } from "@lowcode/share";
import { VideoComponentProps } from "..";
import type { TBasicComponentConfig } from "@lowcode/share";

// @ts-ignore
export const componentPropsList: Record<TComponentTypes, FC<any>> = {
  video: VideoComponentProps,
};

export function getComponentPropsByType(type: TBasicComponentConfig["type"]) {
  return componentPropsList[type];
}
