import type { Container } from "./container.interface";
import type { EditorElement } from "./editor-element.interface";
import type { Text } from "./text.interface";
import { v4 as uuidv4 } from "uuid"

export const createElement = (type: string) : EditorElement | null => {
    switch(type) {
        case "container":
            return {
                uuid: uuidv4(),
                type: "container",
                name: "Container",
                columns: 1,
                content: [],
                background: "#FFFFFF"
            } as Container
        case "text":
            return {
                uuid: uuidv4(),
                type: "text",
                name: "Text",
                content: "Text",
                color: "#000000",
                size: 16,
                align: "left"
            } as Text
        default:
            return null;
    }
}