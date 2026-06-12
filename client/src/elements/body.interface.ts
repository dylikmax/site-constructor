import type { ImageUrl } from "../types.ts";
import type { EditorElement } from "./editor-element.interface.ts";

export interface Body extends EditorElement {
    name: "Body";
    type: "body";
    content: EditorElement[];
    background: string | ImageUrl;
}