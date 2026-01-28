import { useEffect, useRef, useState, type ChangeEvent } from "react"
import type { Text } from "../../../elements"
import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../redux";

interface Props {
    element: Text
    onMouseDown: (e: React.MouseEvent<HTMLTextAreaElement>) => void
    onMouseUp: () => void
}

export const TextElement = ({ element, onMouseDown, onMouseUp } : Props) => {
    const [isChanging, setIsChanging] = useState(false);
    const [value, setValue] = useState(element.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useDispatch();
    const isActive = useSelector((state: RootState) => state.editor.selectedElement?.uuid === element.uuid);

    useEffect(() => {
        if (textareaRef.current && isChanging) {
            textareaRef.current.style.height = 'auto';

            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value, isChanging]);

    useEffect(() => {
        if (!isActive) {
            dispatch(editElement({ ...element, content: value }))
            setIsChanging(false);
        }
    }, [isActive])

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        textareaRef.current?.blur();
        setIsChanging(!isChanging);

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(
                    textareaRef.current.value.length,
                    textareaRef.current.value.length
                );
            }
        }, 0);
    }

    const handleBlur = () => {
        setIsChanging(false);
        dispatch(editElement({ ...element, content: value }))
    }

    return <div 
        className="p-2 whitespace-pre-wrap"
        style={{
            fontSize: element.size,
            color: element.color,
            textAlign: element.align,
        }}
        onDoubleClick={handleDoubleClick}
        >
            {isChanging && isActive ? <textarea
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                rows={1}
                ref={textareaRef}
                className="bg-gray-600 focus:outline-0 w-full [text-align:inherit] resize-none overflow-hidden bg-opacity-20"
            /> : element.content}
    </div>
}