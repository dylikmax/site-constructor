import type { Hex, ImageUrl } from "../types.ts";
import type { EditorElement } from "./editor-element.interface.ts";

export interface Container extends EditorElement {
    columns: number;
    type: "container";
    content: EditorElement[];
    background: Hex | ImageUrl;
}