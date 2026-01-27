import { useSelector } from "react-redux"
import type { RootState } from "../../../../redux"
import { LayerElement } from "./LayerElement"

export const Layers = () => {
    const body = useSelector((state: RootState) => state.editor.bodyElement)
    
    return <div className="flex flex-col gap-2 bg-gray-900 rounded-lg h-full">
        {body.content.map((el, i) => <LayerElement
            element={el}
            parentElement={body}
            index={i}
            key={el.uuid}
        />)}
    </div>
}