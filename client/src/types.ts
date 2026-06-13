import type { ReactNode } from "react";
import { SERVER_URL } from "./constants";

export type ImageUrl = `${typeof SERVER_URL}/${string}.png` 
                    | `${typeof SERVER_URL}/${string}.jpg`
                    | `${typeof SERVER_URL}/${string}.jpeg`
                    | `${typeof SERVER_URL}/${string}.gif`
                    | `${typeof SERVER_URL}/${string}.svg`
                    | `${typeof SERVER_URL}/${string}.webp`
export type Route = `/${string}`;
export type TextAlign = "left" | "right" | "center" | "justify";
export type SettingChoice<T> = {
    id: number;
    visual: ReactNode;
    value: T;
}

export type ModalName = "color" | "size" | "backgroundColor" | null