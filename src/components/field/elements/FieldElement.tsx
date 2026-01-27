import type { Body, Container, EditorElement, Text } from "../../../elements"
import { BodyElement } from "./Body"
import { ContainerElement } from "./Container"
import { TextElement } from "./Text"

interface Props {
    element: EditorElement
}

export const FieldElement = ({ element } : Props) => {
    switch(element.type) {
        case "body":
            return <BodyElement element={element as Body}/>
        case "container":
            return <ContainerElement element={element as Container}/>
        case "text":
            return <TextElement element={element as Text}/>
        default:
            return <></>
    }
}