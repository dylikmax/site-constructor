import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../../redux"
import { LayerElement } from "./LayerElement"
import { selectElement } from "../../../../redux/slices/editor.slice";

export const Layers = () => {
    const body = useSelector((state: RootState) => state.editor.bodyElement);
    const dispatch = useDispatch()

    const handleClick = () => dispatch(selectElement(null));
    
    return <div 
        className="flex flex-col gap-2 bg-gray-900 rounded-lg h-full"
        onClick={handleClick}
    >
        {body.content.map((el, i) => <LayerElement
            element={el}
            parentElement={body}
            index={i}
            key={el.uuid}
        />)}
    </div>
}