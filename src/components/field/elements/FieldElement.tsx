import { useDispatch, useSelector } from "react-redux"
import { createElement, type Body, type Container, type EditorElement, type Text } from "../../../elements"
import { BodyElement } from "./Body"
import { ContainerElement } from "./Container"
import { TextElement } from "./Text"
import { addElement, type RootState } from "../../../redux"
import { deleteElement, moveElement, selectElement } from "../../../redux/slices/editor.slice"
import clsx from "clsx"
import { useRef } from "react"
import { TrashIcon } from "../../../assets/icons"

interface Props {
    element: EditorElement;
    parentUuid: string;
    index: number;
}

export const FieldElement = ({ element, parentUuid, index } : Props) => {
    const dispatch = useDispatch();
    const isActive = useSelector((state: RootState) => state.editor.selectedElement?.uuid === element.uuid);

    const isDraggingFromInput = useRef(false);

    const handleInputMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        isDraggingFromInput.current = true;
        e.stopPropagation();
    }

    const handleInputMouseUp = () => {
        isDraggingFromInput.current = false;
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isDraggingFromInput.current) {
            e.preventDefault();
            return;
        }

        e.dataTransfer.setData('application/elements', JSON.stringify(element));
        dispatch(selectElement(element));
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const type = e.dataTransfer.getData('application/components');

        if (!type) {
            const draggedElement = JSON.parse(e.dataTransfer.getData('application/elements'));

            if ("content" in element && Array.isArray(element.content)) {
                dispatch(moveElement({ element: draggedElement, parentUuid: element.uuid }));
                return;
            }

            dispatch(moveElement({ element: draggedElement, parentUuid, index }))
        } else {
            const newElement = createElement(type);
            if (!newElement) {
                return;
            }

            if ("content" in element && Array.isArray(element.content)) {
                dispatch(addElement({ element: newElement, parentUuid: element.uuid }));
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

    const handleTrashClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        dispatch(deleteElement(element));
    }

    if (element.type === "body") {
        return <div 
            className="h-full overflow-y-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <BodyElement element={element as Body}/>
        </div>
    }

    return <div className="relative">
        {isActive ? <div 
            className="bg-blue-600 w-min p-1 rounded-t absolute -left-[1px] cursor-pointer -translate-y-full"
            onClick={handleTrashClick}
        >
            <TrashIcon size={20} color={"white"}/>
        </div> : <></>}
        <div 
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
                        return <TextElement 
                            element={element as Text}
                            onMouseDown={handleInputMouseDown}
                            onMouseUp={handleInputMouseUp}
                        />
                    default:
                        return <></>
                }
            })()}
        </div>
    </div>
}