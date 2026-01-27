import { useDispatch, useSelector } from "react-redux"
import type { Body, Container, EditorElement, Text } from "../../../elements"
import { BodyElement } from "./Body"
import { ContainerElement } from "./Container"
import { TextElement } from "./Text"
import { addElement, type RootState } from "../../../redux"
import { v4 as uuidv4 } from "uuid"
import { moveElement, selectElement } from "../../../redux/slices/editor.slice"
import clsx from "clsx"

interface Props {
    element: EditorElement;
    parentUuid: string;
    index: number;
}

const createElement = (type: string) : EditorElement | null => {
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
                content: "Text Placeholder",
                color: "#000000",
                size: 16,
                align: "left"
            } as Text
        default:
            return null;
    }
}

export const FieldElement = ({ element, parentUuid, index } : Props) => {
    const dispatch = useDispatch();
    const isActive = useSelector((state: RootState) => state.editor.selectedElement?.uuid === element.uuid)

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.dataTransfer.setData('application/elements', JSON.stringify(element))
        dispatch(selectElement(element));
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const type = e.dataTransfer.getData('application/components');

        if (!type) {
            const draggedElement = JSON.parse(e.dataTransfer.getData('application/elements'));

            dispatch(moveElement({ element: draggedElement, parentUuid, index }))
        } else {
            const newElement = createElement(type);
            if (!newElement) {
                return;
            }

            dispatch(addElement({ element: newElement, parentUuid, index }))
        }
        
        e.dataTransfer.clearData('application/components');
        e.dataTransfer.clearData('application/elements');
    }

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        dispatch(selectElement(element));
    }


    if (element.type === "body") {
        return <BodyElement element={element as Body}/>;
    }

    return <div 
        className={clsx("", {
            "outline outline-2 outline-blue-600 outline-offset-[-1px] cursor-default": isActive,
            "outline outline-1 outline-dashed outline-gray-800 cursor-pointer": !isActive
        })}
        draggable
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragStart={handleDragStart}
        onClick={handleClick}
    >
        {(() => {
            switch(element.type) {
                case "container":
                    return <ContainerElement element={element as Container}/>
                case "text":
                    return <TextElement element={element as Text}/>
                default:
                    return <></>
            }
        })()}
    </div>
}