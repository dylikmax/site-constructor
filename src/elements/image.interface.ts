import type { ImageUrl } from "../types.ts";
import type { EditorElement } from "./editor-element.interface.ts";

export interface Image extends EditorElement {
    type: "image";
    url: ImageUrl;
    width: number;
    heigth: number;
}