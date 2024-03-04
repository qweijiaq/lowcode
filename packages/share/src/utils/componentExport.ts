import type { FC } from "react";
import type { TComponentTypes } from "..";
import {
  CardComponent,
  ImageComponent,
  ListComponent,
  SwiperComponent,
  VideoComponent,
  TextComponent,
  SplitComponent,
  EmptyComponent,
} from "..";

// @ts-ignore
export const componentList: Record<TComponentTypes, FC<any>> = {
  video: VideoComponent,
  image: ImageComponent,
  swiper: SwiperComponent,
  card: CardComponent,
  list: ListComponent,
  titleText: TextComponent,
  split: SplitComponent,
  empty: EmptyComponent,
};