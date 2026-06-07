import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../../redux"
import { LayerElement } from "./LayerElement"
import { selectElement } from "../../../../redux/slices/editor.slice";

export const Layers = () => {
    const body = useSelector((state: RootState) => state.editor.bodyElement);
    const dispatch = useDispatch()

    const handleClick = () => dispatch(selectElement(null));
    
    return <div className="flex bg-gray-900 overflow-y-hidden rounded-lg h-full">
            <div 
            className="flex flex-col gap-2 overflow-auto min-w-max w-full pb-10"
            onClick={handleClick}
        >
            {body.content.map((el, i) => <LayerElement
                element={el}
                parentElement={body}
                index={i}
                key={el.uuid}
            />)}
        </div>
    </div>
}