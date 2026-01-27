import { useState, type ChangeEvent } from "react"
import type { Text } from "../../../elements"
import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../redux";

interface Props {
    element: Text
}

export const TextElement = ({ element } : Props) => {
    const [isChanging, setIsChanging] = useState(false);
    const [value, setValue] = useState(element.content);
    const dispatch = useDispatch();
    const isActive = useSelector((state: RootState) => state.editor.selectedElement?.uuid === element.uuid);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsChanging(true)
    }

    const handleBlur = () => {
        setIsChanging(false);
        dispatch(editElement({ ...element, content: value }))
    }

    return <div 
        className="p-2"
        style={{
            fontSize: element.size,
            color: element.color,
            textAlign: element.align,
        }}
        onDoubleClick={handleDoubleClick}
        >
            {isChanging && isActive ? <input
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-inherit focus:outline-0 w-full [text-align:inherit]"
            /> : element.content}
    </div>
}