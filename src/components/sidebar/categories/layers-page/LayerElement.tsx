import { useRef, useState, type ChangeEvent } from "react";
import type { EditorElement } from "../../../../elements"
import { elementIcons } from "../../element-icons";
import clsx from "clsx";
import { ArrowIcon } from "../../../../assets/icons";
import { useDispatch } from "react-redux";
import { editElement } from "../../../../redux";
import { moveElement } from "../../../../redux/slices/editor.slice";

interface Props {
    element: EditorElement;
    parentElement: EditorElement;
    index: number
}

const ICON_SIZE = 30;

export const LayerElement = ({ element, parentElement, index } : Props) => {
    const [isOpened, setIsOpened] = useState(false);
    const [name, setName] = useState(element.name);
    const dispatch = useDispatch();
    let lastName = element.name;

    const isDraggingFromInput = useRef(false);

    const handleClick = () => setIsOpened(!isOpened)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleBlur = (_: React.FocusEvent<HTMLInputElement>) => {
        isDraggingFromInput.current = false;
        if (element.name === name || !name) {
            setName(lastName);
            return;
        }

        dispatch(editElement({ ...element, name }))
    }

    const handleInputMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
        isDraggingFromInput.current = true;
        e.stopPropagation();
    }

    const handleInputMouseUp = () => {
        isDraggingFromInput.current = false;
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (isDraggingFromInput.current) {
            e.preventDefault();
            return;
        }

        e.stopPropagation();
        e.dataTransfer.setData('application/json', JSON.stringify(element));
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const json = e.dataTransfer.getData('application/json');
        const draggedItem = JSON.parse(json);
        
        dispatch(moveElement({ element: draggedItem, parentUuid: parentElement.uuid, index }));
    }

    const icon = elementIcons("white", ICON_SIZE)[element.type as keyof ReturnType<typeof elementIcons>] || <></>

    return <div className={clsx("flex flex-col gap-2 bg-gray-900 rounded-lg pl-3 pt-2", {
        "pb-0": "content" in element && Array.isArray(element.content) && element.content.length,
        "rounded-none border-t border-gray-600": parentElement.type !== "body"
        }
        )} 
        draggable
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
    >

        <div className="flex justify-between items-center">

            <div className="flex gap-2 items-center">
                {icon}
                <input 
                    className="text-sm bg-gray-900 inline-block w-auto pointer-events-auto" 
                    value={name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onMouseDown={handleInputMouseDown}
                    onMouseUp={handleInputMouseUp}
                    size={name.length || 1}
                />
            </div>

            {"content" in element && Array.isArray(element.content) ? 
                <div 
                    onClick={handleClick}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                <ArrowIcon 
                    color="white" 
                    size={10} 
                    className={clsx("cursor-pointer mr-3 duration-100", {
                    "-rotate-90": !isOpened
            }
            )}/></div> : <></>}
        </div>

        <div>
            {"content" in element && Array.isArray(element.content) && isOpened ? 
            element.content.map((el, i) => <LayerElement
                element={el}
                parentElement={element}
                index={i}
                key={el.uuid}
            />) : <></>}
        </div>
    </div>
}