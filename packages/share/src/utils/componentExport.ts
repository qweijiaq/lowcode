import type { FC } from "react";
import { TComponentTypes, VideoComponent } from "../components";

// @ts-ignore
export const componentList: Record<TComponentTypes, FC<any>> = {
  video: VideoComponent,
};
