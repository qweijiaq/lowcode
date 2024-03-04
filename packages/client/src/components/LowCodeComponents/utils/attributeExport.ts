import type { FC } from "react";
import {
  ImageComponentProps,
  SwiperComponentProps,
  VideoComponentProps,
  CardComponentProps,
  ListComponentProps,
  TextComponentProps,
  SplitComponentProps,
  EmptyComponentProps,
} from "..";
import type { TBasicComponentConfig, TComponentTypes } from "@lowcode/share";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentPropsList: Record<TComponentTypes, FC<any>> = {
  video: VideoComponentProps,
  image: ImageComponentProps,
  swiper: SwiperComponentProps,
  card: CardComponentProps,
  list: ListComponentProps,
  titleText: TextComponentProps,
  split: SplitComponentProps,
  empty: EmptyComponentProps,
};

export function getComponentPropsByType(type: TBasicComponentConfig["type"]) {
  return componentPropsList[type];
}
