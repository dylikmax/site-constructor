import { useRef, useState, type ChangeEvent } from "react";
import type { EditorElement } from "../../../../elements"
import { elementIcons } from "../../element-icons";
import clsx from "clsx";
import { ArrowIcon } from "../../../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../../redux";
import { moveElement, selectElement } from "../../../../redux/slices/editor.slice";

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
    const isSelected = useSelector((state: RootState) => state.editor.selectedElement?.uuid === element.uuid)

    let lastName = element.name;

    const isDraggingFromInput = useRef(false);

    const handleClickArrow = () => setIsOpened(!isOpened)

    const handleClickLayer = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        dispatch(selectElement(element))
    };

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
        e.dataTransfer.setData('application/layers', JSON.stringify(element));
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const str = e.dataTransfer.getData('application/layers');
        if (!str) {
            return;
        }
        
        const draggedItem = JSON.parse(str);
        
        dispatch(moveElement({ element: draggedItem, parentUuid: parentElement.uuid, index }));
    }

    const icon = elementIcons("white", ICON_SIZE)[element.type as keyof typeof elementIcons] || <></>

    return <div className={clsx("flex flex-col gap-2 rounded-lg pl-3 pt-2", {
        "pb-0": "content" in element && Array.isArray(element.content) && element.content.length,
        "rounded-none border-t border-gray-600": parentElement.type !== "body",
        "bg-gray-900 cursor-pointer": !isSelected,
        "bg-gray-700 cursor-default": isSelected
        }
        )} 
        draggable
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClickLayer}
    >

        <div className="flex justify-between items-center">

            <div className="flex gap-2 items-center">
                {icon}
                <input 
                    className="text-sm bg-inherit inline-block w-auto pointer-events-auto" 
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
                    onClick={handleClickArrow}
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