import type { Hex, ImageUrl, Route } from "../types.ts";
import type { EditorElement } from "./editor-element.interface.ts";

export interface Button extends EditorElement {
    content: EditorElement[];
    type: "button"
    url: Route | string;
    background: Hex | ImageUrl;
}