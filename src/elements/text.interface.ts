import type { Hex, TextAlign } from "../types.ts";
import type { EditorElement } from "./editor-element.interface.ts";

export interface Text extends EditorElement {
    type: "text";
    content: string;
    color: Hex;
    size: number;
    align: TextAlign;
}